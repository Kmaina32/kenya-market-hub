import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile" // Custom hook to detect mobile
import { cn } from "@/lib/utils" // Utility for conditionally joining class names
import { Button } from "@/components/ui/button" // Shadcn UI Button component
import { Input } from "@/components/ui/input" // Shadcn UI Input component
import { Separator } from "@/components/ui/separator" // Shadcn UI Separator component
import { Sheet, SheetContent } from "@/components/ui/sheet" // Shadcn UI Sheet (for mobile offcanvas)
import { Skeleton } from "@/components/ui/skeleton" // Shadcn UI Skeleton for loading states
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip" // Shadcn UI Tooltip components

// --- Constants for Sidebar Configuration ---
/**
 * The name used for the sidebar state cookie.
 */
const SIDEBAR_COOKIE_NAME = "sidebar:state"
/**
 * The maximum age of the sidebar state cookie in seconds (7 days).
 */
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
/**
 * The default expanded width of the sidebar on desktop.
 */
const SIDEBAR_WIDTH = "16rem"
/**
 * The width of the sidebar when in mobile offcanvas mode.
 */
const SIDEBAR_WIDTH_MOBILE = "18rem"
/**
 * The width of the sidebar when collapsed to an icon-only state.
 */
const SIDEBAR_WIDTH_ICON = "3rem"
/**
 * The keyboard shortcut key to toggle the sidebar (e.g., Cmd/Ctrl + B).
 */
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// --- Sidebar Context Definition ---
/**
 * Defines the shape of the sidebar context, providing state and functions
 * to control the sidebar's behavior.
 */
type SidebarContextType = {
  /**
   * The current visual state of the sidebar: "expanded" or "collapsed".
   */
  state: "expanded" | "collapsed"
  /**
   * Boolean indicating if the sidebar is currently open (desktop).
   */
  open: boolean
  /**
   * Function to set the open/collapsed state of the sidebar.
   * @param value - A boolean or a function that receives the current state and returns the new state.
   */
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void
  /**
   * Boolean indicating if the mobile offcanvas sidebar is currently open.
   */
  openMobile: boolean
  /**
   * Function to set the open/closed state of the mobile offcanvas sidebar.
   * @param value - A boolean or a function that receives the current state and returns the new state.
   */
  setOpenMobile: (value: boolean | ((value: boolean) => boolean)) => void
  /**
   * Boolean indicating if the current device is mobile.
   */
  isMobile: boolean
  /**
   * Function to toggle the sidebar's state (collapsed/expanded or open/closed for mobile).
   */
  toggleSidebar: () => void
}

/**
 * React Context for managing sidebar state globally within the provider's scope.
 */
const SidebarContext = React.createContext<SidebarContextType | null>(null)

/**
 * Custom hook to access the sidebar context.
 * Throws an error if used outside of a SidebarProvider.
 * @returns The sidebar context object.
 */
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

// --- SidebarProvider Component ---
/**
 * Provides the sidebar context to its children. Manages the sidebar's open/collapsed state,
 * handles persistence via cookies, and provides functions to interact with the sidebar.
 *
 * @param props.defaultOpen - Initial open state of the sidebar (default: true).
 * @param props.open - Controlled open state (overrides internal state if provided).
 * @param props.onOpenChange - Callback for when the open state changes (for controlled component).
 * @param props.className - Additional CSS classes for the wrapper div.
 * @param props.style - Inline styles for the wrapper div.
 * @param props.children - React children to render within the provider.
 */
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile() // Detects if the current device is mobile
    const [openMobile, setOpenMobile] = React.useState(false) // State for mobile offcanvas sidebar

    // Internal state for desktop sidebar visibility.
    // Prioritizes `openProp` if provided (controlled component).
    const [_open, _setOpen] = React.useState(() => {
      // Initialize state from cookie or defaultOpen
      if (typeof window !== 'undefined') {
        const savedState = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
          ?.split('=')[1];
        return savedState ? savedState === 'true' : defaultOpen;
      }
      return defaultOpen;
    });

    const open = openProp ?? _open; // Use controlled prop or internal state
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        // Persist the sidebar state in a cookie
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    /**
     * Toggles the sidebar's open/collapsed state.
     * On mobile, it toggles the `openMobile` state for the Sheet component.
     * On desktop, it toggles the `open` state for the main sidebar.
     */
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((currentOpen) => !currentOpen)
        : setOpen((currentOpen) => !currentOpen)
    }, [isMobile, setOpen, setOpenMobile])

    // Effect to add a keyboard shortcut listener for toggling the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Check for Cmd/Ctrl + SIDEBAR_KEYBOARD_SHORTCUT
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault() // Prevent default browser actions (e.g., Cmd+B for bold)
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // Determine the sidebar's state for data attributes (e.g., data-state="expanded").
    const state = open ? "expanded" : "collapsed"

    // Memoize the context value to prevent unnecessary re-renders of consumers.
    const contextValue = React.useMemo<SidebarContextType>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        {/* TooltipProvider wraps the entire sidebar to ensure tooltips work */}
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                // Define CSS variables for sidebar widths, making them accessible via CSS.
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE, // Added for consistency
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              // Apply a background to the wrapper if the variant is 'inset'
              "has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// --- Sidebar Component ---
/**
 * Renders the main sidebar container. Handles responsiveness (mobile Sheet vs. desktop div)
 * and applies styling based on variant and collapsible options.
 *
 * @param props.side - The side on which the sidebar appears ("left" or "right").
 * @param props.variant - Visual style of the sidebar: "sidebar" (full height), "floating" (rounded, shadowed), "inset" (inset from wrapper).
 * @param props.collapsible - How the sidebar collapses: "offcanvas" (slides out of view), "icon" (collapses to icons), "none" (not collapsible).
 * @param props.className - Additional CSS classes for the sidebar container.
 * @param props.children - React children to render inside the sidebar.
 */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    // If collapsible is "none", render a simple, non-collapsible sidebar.
    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-white text-sidebar-foreground border-r border-gray-200",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    // Render a Sheet component for mobile (offcanvas behavior).
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            // Hide the default close button of SheetContent
            className="w-[--sidebar-width-mobile] bg-white p-0 text-sidebar-foreground [&>button]:hidden border-r border-gray-200"
            side={side}
          >
            {/* Inner div to ensure children fill the SheetContent */}
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    // Render desktop sidebar with collapsible behavior.
    return (
      <div
        ref={ref}
        // `peer` is used for Tailwind's sibling-based styling (e.g., `peer-data-[state=collapsed]`)
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state} // "expanded" or "collapsed"
        data-collapsible={state === "collapsed" ? collapsible : ""} // Only apply collapsible type when collapsed
        data-variant={variant} // "sidebar", "floating", or "inset"
        data-side={side} // "left" or "right"
      >
        {/*
          This div creates the "gap" or "space" for the sidebar on the main content side.
          Its width transitions to simulate the sidebar expanding/collapsing.
        */}
        <div
          className={cn(
            "duration-200 relative h-svh transition-[width] ease-linear",
            // Default width when expanded
            "w-[--sidebar-width]",
            // Offcanvas variant: width becomes 0 when collapsed (sidebar slides completely out)
            "group-data-[collapsible=offcanvas]:w-0",
            // Icon variant: width becomes icon width when collapsed
            "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
            // Adjust width for floating/inset variants when collapsed to icon
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" // Icon width + padding
              : "",
            // Rotate for right-sided sidebar to correctly apply width transitions
            "group-data-[side=right]:rotate-180"
          )}
        />
        {/*
          This is the actual visual sidebar element.
          It's fixed position and its left/right property transitions.
        */}
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
            // Positioning based on 'side' prop and 'offcanvas' collapsible state
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Default width when expanded
            "w-[--sidebar-width]",
            // Width when collapsed to icon
            "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
            // Apply padding and border for floating/inset variants
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" // Icon width + padding + border
              : "group-data-[side=left]:border-r group-data-[side=right]:border-l", // Only apply border for default 'sidebar' variant
            className
          )}
          {...props}
        >
          {/* Inner div for sidebar content styling */}
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col bg-white",
              // Apply border for default 'sidebar' variant (when not floating/inset)
              variant === "sidebar" ? "border-r border-gray-200" : "",
              // Styling for 'floating' variant
              "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// --- SidebarTrigger Component ---
/**
 * A button component that toggles the sidebar's open/collapsed state.
 * It typically contains an icon like `PanelLeft`.
 *
 * @param props.className - Additional CSS classes.
 * @param props.onClick - Optional click handler to be called before toggleSidebar.
 */
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event) // Call any provided onClick handler first
        toggleSidebar() // Then toggle the sidebar
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span> {/* For accessibility */}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// --- SidebarRail Component ---
/**
 * A draggable-like element that can also toggle the sidebar.
 * It provides visual feedback for resizing/collapsing.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar" // For accessibility
      tabIndex={-1} // Not focusable via tab key, activated by click/drag
      onClick={toggleSidebar}
      title="Toggle Sidebar" // Tooltip on hover
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear",
        // Pseudo-element for the visual rail line
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border",
        // Positioning based on side
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
        "sm:flex", // Only show on small screens and up
        // Cursor changes based on side and state
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        // Adjustments for offcanvas collapsible variant
        "group-data-[collapsible=offcanvas]:translate-x-0",
        "group-data-[collapsible=offcanvas]:after:left-full",
        "group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

// --- SidebarInset Component ---
/**
 * Represents the main content area when the sidebar has an "inset" variant.
 * It adjusts its margins and styling based on the sidebar's state.
 *
 * @param props.className - Additional CSS classes.
 * @param props.children - React children to render inside the inset area.
 */
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        // Styling when sidebar is 'inset' variant
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2",
        "md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        // Adjust left margin for collapsed state with 'inset' variant
        "md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2", // When collapsed, add ml-2
        "md:peer-data-[state=expanded]:peer-data-[variant=inset]:ml-0", // When expanded, remove ml-0 (default)
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

// --- SidebarInput Component ---
/**
 * A specialized Input component for use within the sidebar, with specific styling.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

// --- SidebarHeader Component ---
/**
 * A container for the header section of the sidebar.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

// --- SidebarFooter Component ---
/**
 * A container for the footer section of the sidebar.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

// --- SidebarSeparator Component ---
/**
 * A separator component for dividing sections within the sidebar.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

// --- SidebarContent Component ---
/**
 * The main scrollable content area of the sidebar.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        // Hide overflow when collapsed to icon to prevent text from showing
        "group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

// --- SidebarGroup Component ---
/**
 * A container for grouping related items within the sidebar.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

// --- SidebarGroupLabel Component ---
/**
 * A label for a sidebar group. Can be rendered as a child of another component using `asChild`.
 *
 * @param props.asChild - If true, the component will be rendered as the child of the element passed to it.
 * @param props.className - Additional CSS classes.
 */
const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Hide label when collapsed to icon
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

// --- SidebarGroupAction Component ---
/**
 * An action button within a sidebar group, typically for expanding/collapsing the group.
 * Can be rendered as a child of another component using `asChild`.
 *
 * @param props.asChild - If true, the component will be rendered as the child of the element passed to it.
 * @param props.className - Additional CSS classes.
 */
const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile for easier tapping.
        "after:absolute after:-inset-2 after:md:hidden",
        // Hide action when collapsed to icon
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

// --- SidebarGroupContent Component ---
/**
 * A container for the content of a sidebar group, typically a list of menu items.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

// --- SidebarMenu Component ---
/**
 * An unordered list (`ul`) for sidebar menu items.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

// --- SidebarMenuItem Component ---
/**
 * A list item (`li`) for a single sidebar menu entry.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)} // `group/menu-item` for peer styling
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

// --- SidebarMenuButton Variants (cva) ---
/**
 * Defines the styling variants for the `SidebarMenuButton` using `class-variance-authority`.
 */
const sidebarMenuButtonVariants = cva(
  // Base styles applied to all variants
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  // Styles for menu items with actions (to reserve space)
  "group-has-[[data-sidebar=menu-action]]/menu-item:pr-8",
  // Styles when collapsed to icon
  "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2",
  // Truncate text for long labels
  "&>span:last-child]:truncate",
  // Icon styling
  "&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// --- SidebarMenuButton Component ---
/**
 * A button component for individual menu items within the sidebar.
 * Supports different variants, sizes, active state, and tooltips when collapsed.
 *
 * @param props.asChild - If true, the component will be rendered as the child of the element passed to it.
 * @param props.isActive - Boolean to indicate if the menu item is currently active.
 * @param props.tooltip - Optional string or TooltipContent props for a tooltip when collapsed.
 * @param props.className - Additional CSS classes.
 * @param props.variant - Visual variant of the button (default, outline).
 * @param props.size - Size of the button (default, sm, lg).
 */
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        // Apply base styles and variants using cn
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          // Hover and active states
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
          // Ensure hover/active styles apply to open Radix UI components
          "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
          className
        )}
        {...props}
      />
    )

    // If no tooltip is provided, just return the button
    if (!tooltip) {
      return button
    }

    // If tooltip is a string, convert it to an object for TooltipContent
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    // Wrap the button with Tooltip components if a tooltip is provided
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          // Tooltip is only visible when sidebar is collapsed and not on mobile
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

// --- SidebarMenuAction Component ---
/**
 * An action button associated with a menu item, typically appearing on hover.
 * Can be rendered as a child of another component using `asChild`.
 *
 * @param props.asChild - If true, the component will be rendered as the child of the element passed to it.
 * @param props.showOnHover - If true, the action button will only appear on hover/focus of its parent menu item.
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        // Positioning based on button size
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        // Hide action when collapsed to icon
        "group-data-[collapsible=icon]:hidden",
        // Show on hover/focus logic
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

// --- SidebarMenuBadge Component ---
/**
 * A badge component for displaying counts or notifications next to a menu item.
 * It's not interactive and is hidden when the sidebar is collapsed to icons.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      // Text color changes on parent button hover/active
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      // Positioning based on button size
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      // Hide badge when collapsed to icon
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

// --- SidebarMenuSkeleton Component ---
/**
 * A skeleton loader for menu items, used during loading states.
 * Can optionally show an icon placeholder.
 *
 * @param props.showIcon - If true, displays a skeleton icon placeholder.
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Generate a random width for the text skeleton to create a more natural loading effect.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%` // Random width between 50% and 90%
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

// --- SidebarMenuSub Component ---
/**
 * An unordered list (`ul`) for nested/sub-menu items within the sidebar.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden", // Hide sub-menu when collapsed to icon
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

// --- SidebarMenuSubItem Component ---
/**
 * A list item (`li`) for a single sub-menu entry.
 *
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(className)} // Added className prop to li
    {...props}
  />
))
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

// --- SidebarMenuSubButton Component ---
/**
 * A button/link component for individual sub-menu items.
 * Supports different sizes and active state. Can be rendered as a child of another component using `asChild`.
 *
 * @param props.asChild - If true, the component will be rendered as the child of the element passed to it.
 * @param props.size - Size of the button (sm, md).
 * @param props.isActive - Boolean to indicate if the sub-menu item is currently active.
 * @param props.className - Additional CSS classes.
 */
const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-none ring-sidebar-ring transition-colors focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        // Hover and active states
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        // Size variants
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        // Hide sub-menu button when collapsed to icon
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

// --- Exported Components ---
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
