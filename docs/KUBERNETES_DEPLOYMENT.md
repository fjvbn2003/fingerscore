# Kubernetes + Helm 배포 가이드

FingerScore 애플리케이션을 Kubernetes 클러스터에 Helm으로 배포하는 방법을 안내합니다.

## 목차

1. [사전 요구사항](#1-사전-요구사항)
2. [클러스터 준비](#2-클러스터-준비)
3. [cert-manager 설치 (TLS 인증서)](#3-cert-manager-설치-tls-인증서)
4. [Ingress Controller 설치](#4-ingress-controller-설치)
5. [Docker 이미지 빌드 및 푸시](#5-docker-이미지-빌드-및-푸시)
6. [Helm Chart 배포](#6-helm-chart-배포)
7. [시크릿 관리](#7-시크릿-관리)
8. [모니터링 설정](#8-모니터링-설정)
9. [문제 해결](#9-문제-해결)

---

## 1. 사전 요구사항

### 필수 도구 설치

```bash
# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Helm 3
brew install helm

# Docker
brew install --cask docker
```

### Kubernetes 클러스터

다음 중 하나의 클러스터가 필요합니다:

| 클라우드 | 서비스 | 특징 |
|---------|-------|------|
| AWS | EKS | 관리형, Auto Scaling |
| GCP | GKE | 관리형, Autopilot 지원 |
| Azure | AKS | 관리형, Azure 통합 |
| On-premise | k3s | 경량, 쉬운 설치 |

### 클러스터 연결 확인

```bash
kubectl cluster-info
kubectl get nodes
```

---

## 2. 클러스터 준비

### 2.1 Namespace 생성

```bash
# 프로덕션 네임스페이스
kubectl create namespace fingerscore

# 개발 네임스페이스 (선택)
kubectl create namespace fingerscore-dev
```

### 2.2 리소스 쿼터 설정 (선택)

```yaml
# resource-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: fingerscore-quota
  namespace: fingerscore
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"
```

```bash
kubectl apply -f resource-quota.yaml
```

---

## 3. cert-manager 설치 (TLS 인증서)

cert-manager는 Let's Encrypt 인증서를 자동으로 발급하고 갱신합니다.

### 3.1 cert-manager 설치

```bash
# cert-manager Helm 저장소 추가
helm repo add jetstack https://charts.jetstack.io
helm repo update

# CRDs 설치 (필수)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.3/cert-manager.crds.yaml

# cert-manager 설치
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.14.3
```

### 3.2 설치 확인

```bash
kubectl get pods -n cert-manager

# 출력 예시:
# NAME                                      READY   STATUS    RESTARTS   AGE
# cert-manager-xxx                          1/1     Running   0          1m
# cert-manager-cainjector-xxx               1/1     Running   0          1m
# cert-manager-webhook-xxx                  1/1     Running   0          1m
```

### 3.3 ClusterIssuer 생성

Helm Chart에 포함되어 있지만, 수동으로 생성할 수도 있습니다:

```yaml
# cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@fingerscore.app  # 실제 이메일로 변경
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

```bash
kubectl apply -f cluster-issuer.yaml
```

---

## 4. Ingress Controller 설치

### 4.1 NGINX Ingress Controller

```bash
# Helm 저장소 추가
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# 설치
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### 4.2 LoadBalancer IP 확인

```bash
kubectl get svc -n ingress-nginx

# EXTERNAL-IP 확인 (클라우드에서 할당)
# NAME                                 TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)
# ingress-nginx-controller             LoadBalancer   10.0.123.45    203.0.113.10     80:31234/TCP,443:31235/TCP
```

### 4.3 DNS 설정

도메인 DNS에서 A 레코드 추가:

```
fingerscore.app     A    203.0.113.10
www.fingerscore.app A    203.0.113.10
```

---

## 5. Docker 이미지 빌드 및 푸시

### 5.1 GitHub Container Registry 사용

```bash
# GitHub 로그인
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 이미지 빌드
cd web
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... \
  --build-arg NEXT_PUBLIC_APP_URL=https://fingerscore.app \
  -t ghcr.io/fjvbn2003/fingerscore:latest \
  -t ghcr.io/fjvbn2003/fingerscore:v1.0.0 \
  .

# 이미지 푸시
docker push ghcr.io/fjvbn2003/fingerscore:latest
docker push ghcr.io/fjvbn2003/fingerscore:v1.0.0
```

### 5.2 Image Pull Secret 생성 (Private Registry)

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=fjvbn2003 \
  --docker-password=$GITHUB_TOKEN \
  --docker-email=your-email@example.com \
  -n fingerscore
```

---

## 6. Helm Chart 배포

### 6.1 의존성 설치

```bash
cd k8s/helm/fingerscore
helm dependency update
```

### 6.2 시크릿 생성 (배포 전)

```bash
kubectl create secret generic fingerscore-secrets \
  --from-literal=supabase-url='https://xxx.supabase.co' \
  --from-literal=supabase-anon-key='eyJhbGci...' \
  --from-literal=supabase-service-role-key='eyJhbGci...' \
  -n fingerscore
```

### 6.3 개발 환경 배포

```bash
helm install fingerscore-dev ./k8s/helm/fingerscore \
  --namespace fingerscore-dev \
  --create-namespace \
  -f ./k8s/helm/fingerscore/values-dev.yaml \
  --set image.tag=dev
```

### 6.4 프로덕션 배포

```bash
helm install fingerscore ./k8s/helm/fingerscore \
  --namespace fingerscore \
  -f ./k8s/helm/fingerscore/values-prod.yaml \
  --set image.tag=v1.0.0
```

### 6.5 배포 확인

```bash
# 파드 상태 확인
kubectl get pods -n fingerscore

# 서비스 확인
kubectl get svc -n fingerscore

# Ingress 확인
kubectl get ingress -n fingerscore

# 인증서 확인
kubectl get certificate -n fingerscore
```

### 6.6 업그레이드

```bash
helm upgrade fingerscore ./k8s/helm/fingerscore \
  --namespace fingerscore \
  -f ./k8s/helm/fingerscore/values-prod.yaml \
  --set image.tag=v1.1.0
```

### 6.7 롤백

```bash
# 히스토리 확인
helm history fingerscore -n fingerscore

# 이전 버전으로 롤백
helm rollback fingerscore 1 -n fingerscore
```

---

## 7. 시크릿 관리

### 7.1 Sealed Secrets (권장)

```bash
# kubeseal 설치
brew install kubeseal

# Sealed Secrets Controller 설치
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm install sealed-secrets sealed-secrets/sealed-secrets \
  --namespace kube-system

# 시크릿 암호화
kubectl create secret generic fingerscore-secrets \
  --from-literal=supabase-url='https://xxx.supabase.co' \
  --dry-run=client -o yaml | \
  kubeseal --format yaml > sealed-secret.yaml

# 적용
kubectl apply -f sealed-secret.yaml -n fingerscore
```

### 7.2 External Secrets Operator (AWS/GCP/Azure)

```bash
# External Secrets Operator 설치
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets \
  --namespace external-secrets \
  --create-namespace
```

```yaml
# external-secret.yaml (AWS Secrets Manager 예시)
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: fingerscore-secrets
  namespace: fingerscore
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: fingerscore-secrets
  data:
    - secretKey: supabase-url
      remoteRef:
        key: fingerscore/production
        property: SUPABASE_URL
```

---

## 8. 모니터링 설정

### 8.1 Prometheus + Grafana

```bash
# kube-prometheus-stack 설치
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### 8.2 ServiceMonitor 추가

```yaml
# servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: fingerscore
  namespace: fingerscore
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: fingerscore
  endpoints:
    - port: http
      path: /api/health
      interval: 30s
```

### 8.3 알림 설정 (AlertManager)

```yaml
# alert-rules.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: fingerscore-alerts
  namespace: fingerscore
spec:
  groups:
    - name: fingerscore
      rules:
        - alert: FingerScorePodDown
          expr: kube_pod_status_ready{namespace="fingerscore",condition="true"} == 0
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "FingerScore pod is down"
```

---

## 9. 문제 해결

### 인증서 발급 실패

```bash
# Challenge 상태 확인
kubectl describe challenge -n fingerscore

# cert-manager 로그 확인
kubectl logs -n cert-manager -l app=cert-manager

# 인증서 이벤트 확인
kubectl describe certificate fingerscore-tls -n fingerscore
```

### Pod 시작 실패

```bash
# 파드 상태 확인
kubectl describe pod <pod-name> -n fingerscore

# 로그 확인
kubectl logs <pod-name> -n fingerscore

# 이전 컨테이너 로그 (재시작된 경우)
kubectl logs <pod-name> -n fingerscore --previous
```

### Ingress 연결 안됨

```bash
# Ingress 상태 확인
kubectl describe ingress fingerscore -n fingerscore

# NGINX 로그 확인
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### 리소스 부족

```bash
# 노드 리소스 확인
kubectl top nodes

# 파드 리소스 확인
kubectl top pods -n fingerscore

# HPA 상태 확인
kubectl get hpa -n fingerscore
```

---

## 빠른 시작 요약

```bash
# 1. 네임스페이스 생성
kubectl create namespace fingerscore

# 2. 시크릿 생성
kubectl create secret generic fingerscore-secrets \
  --from-literal=supabase-url='YOUR_URL' \
  --from-literal=supabase-anon-key='YOUR_KEY' \
  --from-literal=supabase-service-role-key='YOUR_SERVICE_KEY' \
  -n fingerscore

# 3. Helm 배포
cd k8s/helm/fingerscore
helm dependency update
helm install fingerscore . \
  --namespace fingerscore \
  -f values-prod.yaml

# 4. 상태 확인
kubectl get all -n fingerscore
kubectl get certificate -n fingerscore
```

---

## 추가 리소스

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Helm 공식 문서](https://helm.sh/docs/)
- [cert-manager 문서](https://cert-manager.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
