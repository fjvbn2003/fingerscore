import cadquery as cq
from math import cos, sin, radians

# --- PARAMETERS ---
ring_inner_dia = 20.0
ring_thickness = 2.0
band_width = 12.0
open_angle = 50.0

housing_w = 26.0
housing_l = 28.0
housing_h = 10.5
wall_thickness = 1.2
rounding_r = 1.5 # Adjusted for stability

button_hole_d = 4.5
led_hole_d = 2.0
clearance = 0.2

# --- DESIGN ---

# 1. Band
ring_outer_dia = ring_inner_dia + (ring_thickness * 2)
# Oriented along Y axis in SCAD terms, which is default Workplane("XZ") extrude in CQ
band = (
    cq.Workplane("XZ")
    .cylinder(band_width, ring_outer_dia / 2)
    .faces(">Y").hole(ring_inner_dia)
)

# 2. C-Opening (Wedge cut)
pts = [(0, 0), 
       (ring_outer_dia, ring_outer_dia * sin(radians(open_angle / 2))), 
       (ring_outer_dia, -ring_outer_dia * sin(radians(open_angle / 2)))]

wedge = (
    cq.Workplane("XZ")
    .polyline(pts).close()
    .extrude(band_width + 5, both=True)
)
# In SCAD, the opening is "rear" (bottom in 2D top view).
# Let's verify orientation.
band = band.cut(wedge)

# 3. Housing
housing_center_z = (ring_inner_dia / 2) + ring_thickness + (housing_h / 2) - 1.0
housing = (
    cq.Workplane("XY")
    .workplane(offset=housing_center_z)
    .box(housing_w, housing_l, housing_h)
    .edges("|Z or |X or |Y")
    .fillet(rounding_r)
)

# 4. Assembly & Cleanup
result = housing.union(band)

# Crucial: Clean up the ring hole where it intersects the housing
result = result.cut(
    cq.Workplane("XZ")
    .cylinder(housing_l + 10, ring_inner_dia / 2)
)

# Internal Cavity
cavity_w = housing_w - (wall_thickness * 2)
cavity_l = housing_l - (wall_thickness * 2)
cavity_h = housing_h - 1.5
result = result.cut(
    cq.Workplane("XY")
    .workplane(offset=housing_center_z + 0.75)
    .box(cavity_w, cavity_l, cavity_h)
)

# Button Holes (Centered vertically)
for side in [-1, 1]:
    result = result.cut(
        cq.Workplane("YZ")
        .workplane(offset=housing_w/2)
        .center(side * housing_l/4, housing_center_z)
        .circle(button_hole_d/2)
        .extrude(10, both=True)
    )

# USB Port
result = result.cut(
    cq.Workplane("XY")
    .workplane(offset=housing_center_z + 4.5)
    .center(0, housing_l/2)
    .box(10, 8, 4.5) # Made slightly tighter for better fit
)

# 5. Internal Supports
# Support pillars for XIAO (approx 21x17.5mm)
pillar_h = 2.0
pillar_w = 2.0
pillar_pos_x = 17.5 / 2
pillar_pos_y = 21.0 / 2
for x_side in [-1, 1]:
    for y_side in [-1, 1]:
        pillar = (
            cq.Workplane("XY")
            .workplane(offset=housing_center_z - housing_h/2 + 1.2)
            .center(x_side * pillar_pos_x, y_side * pillar_pos_y)
            .box(pillar_w, pillar_w, pillar_h, centered=(True, True, False))
        )
        result = result.union(pillar)

# Switch supports (small ribs near holes)
rib_w = 1.0
rib_l = 4.0
rib_h = 3.0
for side in [-1, 1]:
    for y_off in [-1, 1]:
        rib = (
            cq.Workplane("XY")
            .workplane(offset=housing_center_z - housing_h/2 + 1.2)
            .center(side * (housing_w/2 - 2), side * housing_l/4 + y_off * 3)
            .box(2, rib_w, rib_h, centered=(True, True, False))
        )
        result = result.union(rib)

# 6. Snap-fit Dimples (Small indentations in housing)
snap_r = 0.6
for y_pos in [-housing_l/3, housing_l/3]:
    result = result.cut(
        cq.Workplane("YZ")
        .workplane(offset=housing_w/2 - 0.5)
        .center(y_pos, housing_center_z + housing_h/2 - 1.5)
        .sphere(snap_r)
    )
    result = result.cut(
        cq.Workplane("YZ")
        .workplane(offset=-housing_w/2 + 0.5)
        .center(y_pos, housing_center_z + housing_h/2 - 1.5)
        .sphere(snap_r)
    )

# 7. Lid Improvements
lid = (
    cq.Workplane("XY")
    .box(housing_w, housing_l, wall_thickness)
    .edges("|Z")
    .fillet(rounding_r)
)
lid_insert = (
    cq.Workplane("XY")
    .workplane(offset=-wall_thickness/2 - 0.8)
    .box(housing_w - wall_thickness*2 - clearance, housing_l - wall_thickness*2 - clearance, 1.6)
)

# Snap-fit Bumps on lid insert
for y_pos in [-housing_l/3, housing_l/3]:
    lid_insert = lid_insert.union(
        cq.Workplane("XY")
        .workplane(offset=-wall_thickness/2 - 0.8)
        .center(housing_w/2 - wall_thickness - clearance/2, y_pos)
        .sphere(snap_r + 0.1)
    )
    lid_insert = lid_insert.union(
        cq.Workplane("XY")
        .workplane(offset=-wall_thickness/2 - 0.8)
        .center(-housing_w/2 + wall_thickness + clearance/2, y_pos)
        .sphere(snap_r + 0.1)
    )

lid = lid.union(lid_insert)

lid = lid.cut(
    cq.Workplane("XY")
    .center(2, 0)
    .circle(led_hole_d / 2)
    .extrude(10, both=True)
)

# --- EXPORT ---
print("Exporting finalized STEP files...")
cq.exporters.export(result, 'ring_enclosure_main.step')
cq.exporters.export(lid, 'ring_enclosure_lid.step')
print("Done.")
