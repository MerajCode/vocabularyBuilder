const LTheme = {
  "colors": {
    "primary": "rgb(120, 69, 172)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(240, 219, 255)",
    "onPrimaryContainer": "rgb(44, 0, 81)",
    "secondary": "rgb(102, 90, 111)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(237, 221, 246)",
    "onSecondaryContainer": "rgb(33, 24, 42)",
    "tertiary": "rgb(128, 81, 88)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(255, 217, 221)",
    "onTertiaryContainer": "rgb(50, 16, 23)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(29, 27, 30)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(29, 27, 30)",
    "surfaceVariant": "rgb(233, 223, 235)",
    "onSurfaceVariant": "rgb(74, 69, 78)",
    "outline": "rgb(124, 117, 126)",
    "outlineVariant": "rgb(204, 196, 206)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(50, 47, 51)",
    "inverseOnSurface": "rgb(245, 239, 244)",
    "inversePrimary": "rgb(220, 184, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(248, 242, 251)",
      "level2": "rgb(244, 236, 248)",
      "level3": "rgb(240, 231, 246)",
      "level4": "rgb(239, 229, 245)",
      "level5": "rgb(236, 226, 243)"
    },
    "surfaceDisabled": "rgba(29, 27, 30, 0.12)",
    "onSurfaceDisabled": "rgba(29, 27, 30, 0.38)",
    "backdrop": "rgba(51, 47, 55, 0.4)"
  }
}

const DTheme = {
  "colors": {
    // --- Primary Colors (Main Brand/Accent Colors) ---
    "primary": "rgb(220, 184, 255)",             // Main action color: Contained Button ka background, focused TextInput ka border, active Switch/Checkbox ka color.
    "onPrimary": "rgb(71, 12, 122)",              // Text/icon jab background 'primary' ho: Contained Button ke andar ka text.
    "primaryContainer": "rgb(95, 43, 146)",       // 'primary' ka halka version: Floating Action Button (FAB) ka background.
    "onPrimaryContainer": "rgb(240, 219, 255)",    // Text/icon jab background 'primaryContainer' ho: FAB ke andar ke icon ka color.

    // --- Secondary Colors (Alternative Accent Colors) ---
    "secondary": "rgb(208, 193, 218)",            // Kam important actions ke liye: SegmentedButtons, Chips.
    "onSecondary": "rgb(54, 44, 63)",             // Text/icon jab background 'secondary' ho.
    "secondaryContainer": "rgb(77, 67, 87)",      // 'secondary' ka halka version.
    "onSecondaryContainer": "rgb(237, 221, 246)",  // Text/icon jab background 'secondaryContainer' ho.

    // --- Tertiary Colors (Contrasting Accent Colors) ---
    "tertiary": "rgb(243, 183, 190)",              // Ek aur accent color, alag elements ko highlight karne ke liye.
    "onTertiary": "rgb(75, 37, 43)",              // Text/icon jab background 'tertiary' ho.
    "tertiaryContainer": "rgb(101, 58, 65)",      // 'tertiary' ka halka version.
    "onTertiaryContainer": "rgb(255, 217, 221)",  // Text/icon jab background 'tertiaryContainer' ho.

    // --- Error Colors (For Warnings and Errors) ---
    "error": "rgb(255, 180, 171)",                // Error dikhane ke liye: Invalid TextInput ka border, HelperText ka color.
    "onError": "rgb(105, 0, 5)",                  // Text/icon jab background 'error' ho (rarely used).
    "errorContainer": "rgb(147, 0, 10)",          // Error ka halka version, jaise error banner ka background.
    "onErrorContainer": "rgb(255, 180, 171)",     // Text/icon jab background 'errorContainer' ho.

    // --- Surface & Background Colors (Main Canvas and Component Colors) ---
    "background": "rgb(29, 27, 30)",              // Poori screen ka sabse peeche ka background color.
    "onBackground": "rgb(231, 225, 229)",          // Aisa text jo seedhe 'background' ke upar ho.
    "surface": "rgb(29, 27, 30)",                 // Un components ka background jo screen ke upar aate hain: Card, Dialog, AppBar, Menu.
    "onSurface": "rgb(231, 225, 229)",            // **Sabse common text color**: Card/Dialog ke andar ka text, List.Item ka title.
    "surfaceVariant": "rgb(74, 69, 78)",          // 'surface' se thoda alag background: Unselected Chip ka background.
    "onSurfaceVariant": "rgb(204, 196, 206)",      // **Kam important text**: TextInput ka label/placeholder, HelperText.

    // --- Outline & Dividers ---
    "outline": "rgb(150, 142, 152)",              // Components ki border ke liye: Outlined TextInput/Card ka border.
    "outlineVariant": "rgb(74, 69, 78)",          // Halka border ya divider line ke liye: Divider component.

    // --- Special Use Case Colors ---
    "shadow": "rgb(0, 0, 0)",                     // (Platform-specific shadows ke liye, direct use nahi hota).
    "scrim": "rgb(0, 0, 0)",                      // Jab koi Drawer ya Modal khulta hai to peeche ka overlay color.
    "inverseSurface": "rgb(231, 225, 229)",       // 'surface' ka ulta color: Snackbar ya Toast ka background.
    "inverseOnSurface": "rgb(50, 47, 51)",        // Text/icon jab background 'inverseSurface' ho: Snackbar ke andar ka text.
    "inversePrimary": "rgb(120, 69, 172)",        // 'primary' ka ulta version, 'inverseSurface' par use ke liye.

    // --- Elevation (Shadows for different levels of depth) ---
    "elevation": {                                  // Alag-alag 'surface' ke liye shadow color define karta hai.
      "level0": "transparent",
      "level1": "rgb(39, 35, 41)",                // e.g., AppBar
      "level2": "rgb(44, 40, 48)",                // e.g., Card
      "level3": "rgb(50, 44, 55)",                // e.g., Dialog
      "level4": "rgb(52, 46, 57)",
      "level5": "rgb(56, 49, 62)"                 // e.g., BottomSheet
    },

    // --- Disabled States ---
    "surfaceDisabled": "rgba(231, 225, 229, 0.12)", // Disabled component (e.g., Button) ka background.
    "onSurfaceDisabled": "rgba(231, 225, 229, 0.38)",// Disabled component ka text/icon color.
    "backdrop": "rgba(51, 47, 55, 0.4)"           // Modal ke peeche ka background overlay.
  }
}


export { DTheme, LTheme }

