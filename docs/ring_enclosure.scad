/*
  FingerScore - Premium Aesthetic Wearable Ring (Assembly View)
  Features: Rounded "Jewelry" edges, 2mm Thin Band, Integrated Components.
*/

// --- CONFIGURATION ---
view_mode = "all"; // [main, lid, all]
show_components = true; // [true, false]

// --- PARAMETERS ---
ring_inner_dia = 20;
ring_thickness = 2.0; // Thinner for ergonomics (Premium feel)
band_width = 12; // Narrower band for comfort
open_angle = 50; // Slightly tighter opening

housing_w = 26;
housing_l = 28;
housing_h = 10.5;
wall_thickness = 1.2; // Thinner walls for internal space
rounding_r = 2.0; // Fillet radius for aesthetic rounding

button_hole_d = 4.5;
led_hole_d = 2.0;
clearance = 0.2;

$fn = 64;

// --- COMPONENT MODELS (SIMULATED) ---

module xiao_board() {
  color("Green") translate([0, 1.5, 0]) {
      cube([21.5, 1.5, 18], center=true); // PCB
      color("Silver") translate([0, 1.5, 5]) cube([10, 2, 8], center=true); // SoC Shield
      color("Gray") translate([0, 1.8, 12]) cube([8, 3, 6], center=true); // USB Port
    }
}

module lipo_401012() {
  color("Silver") translate([0, -2, 0])
      cube([13, 4, 11], center=true);
  // 13x11x4mm Approx
}

module tactile_switch() {
  color("Black") union() {
      cube([3, 2.5, 6], center=true); // Body
      color("DarkGray") translate([2, 0, 0]) rotate([0, 90, 0]) cylinder(h=2, d=1.5, center=true); // Plunger
    }
}

// --- UTILS ---
module rounded_box(w, h, l, r) {
  hull() {
    for (x = [-(w / 2 - r), (w / 2 - r)])
      for (y = [-(h / 2 - r), (h / 2 - r)])
        for (z = [-(l / 2 - r), (l / 2 - r)])
          translate([x, y, z]) sphere(r=r);
  }
}

// --- MAIN ENCLOSURE ---
module main_enclosure() {
  difference() {
    union() {
      // Adjustable C-Band (Thinner & Smoothed)
      rotate([90, 0, 0])
        difference() {
          cylinder(h=band_width, d=ring_inner_dia + ring_thickness * 2, center=true);
          cylinder(h=band_width + 2, d=ring_inner_dia, center=true);

          // Opening
          rotate([0, 0, -90])
            linear_extrude(height=band_width + 5, center=true)
              polygon(
                [
                  [0, 0],
                  [20 * cos(open_angle / 2), 20 * sin(open_angle / 2)],
                  [20 * cos(-open_angle / 2), 20 * sin(-open_angle / 2)],
                ]
              );
        }

      // Housing Body (Rounded/Filleted)
      translate([0, ring_inner_dia / 2 + ring_thickness / 2 + (housing_h / 2) - 1, 0])
        rounded_box(housing_w, housing_h, housing_l, rounding_r);
    }

    // Internal Cavity
    translate([0, ring_inner_dia / 2 + ring_thickness / 2 + housing_h / 2 - 0.5, 0])
      cube([housing_w - wall_thickness * 2, housing_h, housing_l - wall_thickness * 2], center=true);

    // Ring Hole Cleanup
    rotate([90, 0, 0]) cylinder(h=housing_l + 5, d=ring_inner_dia, center=true);

    // Button Holes
    for (z = [housing_l / 4, -housing_l / 4])
      translate([housing_w / 2, ring_inner_dia / 2 + ring_thickness + 3.5, z])
        rotate([0, 90, 0]) cylinder(h=10, d=button_hole_d, center=true);

    // USB Port (Enlarged Rear)
    translate([0, ring_inner_dia / 2 + ring_thickness + 6, housing_l / 2])
      cube([14, 8, 10], center=true);

    // Lid Seat
    translate([0, ring_inner_dia / 2 + ring_thickness + housing_h - 2.2, 0])
      cube([housing_w - wall_thickness + clearance, 2.5, housing_l - wall_thickness + clearance], center=true);
  }
}

module lid() {
  difference() {
    union() {
      // Rounded Lid Plate
      translate([0, ring_inner_dia / 2 + ring_thickness + housing_h - wall_thickness / 2 - 0.5, 0])
        hull() {
          rounded_box(housing_w, wall_thickness, housing_l, rounding_r);
        }

      // Snap Pins
      translate([0, ring_inner_dia / 2 + ring_thickness + housing_h - wall_thickness - 1.2, 0])
        cube([housing_w - wall_thickness - clearance, 2.2, housing_l - wall_thickness - clearance], center=true);
    }

    // LED Hole
    translate([2, ring_inner_dia / 2 + ring_thickness + housing_h, 0])
      cylinder(h=10, d=led_hole_d, center=true);
  }
}

// --- RENDER LOGIC ---
if (view_mode == "main") {
  main_enclosure();
} else if (view_mode == "lid") {
  translate([0, -25, 0]) lid();
} else {
  main_enclosure();
  lid();
}

// Components View
if (show_components) {
  translate([0, ring_inner_dia / 2 + ring_thickness + 4, 0]) {
    xiao_board();
    lipo_401012();
    // Side buttons
    translate([housing_w / 2 - 2.5, 2, housing_l / 4]) tactile_switch();
    translate([housing_w / 2 - 2.5, 2, -housing_l / 4]) tactile_switch();
  }
}
