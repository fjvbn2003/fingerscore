/*
  FingerScore - Wearable Ring Enclosure
  Designed for: Seeed Studio XIAO nRF52840
  Includes: 401012 LiPo Battery, 2x 3x6x2.5mm Tactile Buttons
*/

// Parameters
ring_inner_dia = 20; // Internal diameter (Size 10 approx)
ring_thickness = 2.5;
housing_w = 26;
housing_l = 28;
housing_h = 10;
wall_thickness = 1.5;

xiao_w = 21.5;
xiao_l = 18.0;
xiao_h = 4.0;

batt_w = 11;
batt_l = 13;
batt_h = 4.5;

button_hole_d = 4;

$fn = 64;

module ring_base() {
    difference() {
        cylinder(h=housing_l, d=ring_inner_dia + ring_thickness*2, center=true);
        cylinder(h=housing_l+2, d=ring_inner_dia, center=true);
        // Cut top part to attach housing
        translate([0, ring_inner_dia/2 + ring_thickness, 0])
            cube([housing_w+5, ring_thickness*2, housing_l+5], center=true);
    }
}

module housing() {
    difference() {
        // Main Case
        translate([0, ring_inner_dia/2 + ring_thickness/2 + housing_h/2 - 1, 0])
             cube([housing_w, housing_h, housing_l], center=true);
        
        // XIAO Cutout (Top layer)
        translate([0, ring_inner_dia/2 + ring_thickness + housing_h - xiao_h/2 - wall_thickness, 0])
            cube([xiao_w, xiao_h + 0.5, xiao_l], center=true);
        
        // Battery Cutout (Middle layer)
        translate([0, ring_inner_dia/2 + ring_thickness + housing_h - xiao_h - batt_h/2 - wall_thickness - 0.5, 0])
            cube([batt_w, batt_h, batt_l], center=true);
        
        // USB Port Opening
        translate([0, ring_inner_dia/2 + ring_thickness + housing_h - xiao_h/2 - wall_thickness, housing_l/2])
            cube([10, 6, 5], center=true);
            
        // Button Holes
        translate([housing_w/2 - 2, ring_inner_dia/2 + ring_thickness + 4, housing_l/4])
            rotate([0, 90, 0]) cylinder(h=10, d=button_hole_d, center=true);
        translate([housing_w/2 - 2, ring_inner_dia/2 + ring_thickness + 4, -housing_l/4])
            rotate([0, 90, 0]) cylinder(h=10, d=button_hole_d, center=true);
            
        // Inner Ring Connector cleanup
        cylinder(h=housing_l+1, d=ring_inner_dia, center=true);
    }
}

// Render
union() {
    rotate([90, 0, 0]) ring_base();
    housing();
}
