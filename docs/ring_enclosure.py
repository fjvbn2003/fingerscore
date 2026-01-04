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

# Button Holes
for side in [-1, 1]:
    result = result.cut(
        cq.Workplane("YZ")
        .workplane(offset=housing_w/2)
        .center(side * housing_l/4, housing_center_z - housing_h/2 + 3.5)
        .circle(button_hole_d/2)
        .extrude(10, both=True)
    )

# USB Port
result = result.cut(
    cq.Workplane("XY")
    .workplane(offset=housing_center_z + 6)
    .center(0, housing_l/2)
    .box(14, 10, 8)
)

# 5. Lid
lid = (
    cq.Workplane("XY")
    .box(housing_w, housing_l, wall_thickness)
    .edges("|Z")
    .fillet(rounding_r)
)
lid = lid.union(
    cq.Workplane("XY")
    .workplane(offset=-wall_thickness/2 - 1.1)
    .box(housing_w - wall_thickness - clearance, housing_l - wall_thickness - clearance, 2.2)
)
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
