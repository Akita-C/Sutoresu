"use client";

import Link from "next/link";
import { Store, LogIn, Phone, MessageSquare, Bug } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggleSimple } from "@/components/common/theme-toggle-simple";
import { cn } from "@/lib/utils";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { UserAvatar } from "@/features/auth/components/user-avatar";

// Mock data cho Products menu
const productsData = {
  leftColumn: [
    {
      title: "Laptops & Computers",
      description: "Máy tính xách tay và PC cao cấp",
      href: "/products/laptops",
      icon: "💻",
    },
    {
      title: "Smartphones",
      description: "Điện thoại thông minh mới nhất",
      href: "/products/smartphones",
      icon: "📱",
    },
    {
      title: "Gaming Gear",
      description: "Thiết bị gaming chuyên nghiệp",
      href: "/products/gaming",
      icon: "🎮",
    },
    {
      title: "Audio & Video",
      description: "Thiết bị âm thanh và video",
      href: "/products/audio-video",
      icon: "🎧",
    },
  ],
  rightColumn: [
    {
      title: "Accessories",
      description: "Phụ kiện công nghệ đa dạng",
      href: "/products/accessories",
      icon: "🔌",
    },
    {
      title: "Smart Home",
      description: "Thiết bị nhà thông minh",
      href: "/products/smart-home",
      icon: "🏠",
    },
    {
      title: "Cameras",
      description: "Máy ảnh và thiết bị quay phim",
      href: "/products/cameras",
      icon: "📷",
    },
    {
      title: "Wearables",
      description: "Thiết bị đeo tay và smartwatch",
      href: "/products/wearables",
      icon: "⌚",
    },
  ],
};

// Mock data cho Contact menu
const contactData = [
  {
    title: "Contact Sales",
    description: "Liên hệ đội bán hàng để được tư vấn sản phẩm",
    href: "/contact/sales",
    icon: Phone,
  },
  {
    title: "Contact Support",
    description: "Hỗ trợ kỹ thuật và giải đáp thắc mắc",
    href: "/contact/support",
    icon: MessageSquare,
  },
  {
    title: "Submit Bug Report",
    description: "Báo cáo lỗi và góp ý cải thiện",
    href: "/contact/bug-report",
    icon: Bug,
  },
];

const ListItem = ({
  className,
  title,
  children,
  icon,
  IconComponent,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon?: string;
  IconComponent?: React.ComponentType<{ className?: string }>;
} & React.ComponentPropsWithoutRef<"a">) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            {IconComponent && (
              <IconComponent className="h-4 w-4 text-primary group-hover:text-accent-foreground" />
            )}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Sutoresu</span>
            </Link>
          </div>

          {/* Navigation Menu - Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[700px] lg:grid-cols-2">
                      {/* Left Column */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-none mb-3 text-muted-foreground border-b border-border pb-2">
                          Electronics & Tech
                        </h4>
                        <ul className="space-y-1">
                          {productsData.leftColumn.map((item) => (
                            <ListItem
                              key={item.title}
                              title={item.title}
                              href={item.href}
                              icon={item.icon}
                            >
                              {item.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-none mb-3 text-muted-foreground border-b border-border pb-2">
                          Lifestyle & More
                        </h4>
                        <ul className="space-y-1">
                          {productsData.rightColumn.map((item) => (
                            <ListItem
                              key={item.title}
                              title={item.title}
                              href={item.href}
                              icon={item.icon}
                            >
                              {item.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">
                    Contact
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 md:w-[400px]">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium leading-none mb-3 text-muted-foreground border-b border-border pb-2">
                          Get in Touch
                        </h4>
                        <ul className="space-y-1">
                          {contactData.map((item) => (
                            <ListItem
                              key={item.title}
                              title={item.title}
                              href={item.href}
                              IconComponent={item.icon}
                            >
                              {item.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <AuthGuard
              requireAuth={true}
              fallback={
                <Button variant="default" size="sm" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Log in</span>
                  </Link>
                </Button>
              }
            >
              <UserAvatar />
            </AuthGuard>

            {/* Theme Toggle */}
            <ThemeToggleSimple />
          </div>
        </div>
      </div>
    </header>
  );
}
