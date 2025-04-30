import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetTitle
} from '@/components/ui/sheet'
import { Link, NavLink, NavLinkProps, Outlet } from 'react-router'
import { ChevronDown, MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from './mode-toggle'
import { useUser } from '@/hooks/use-user'
import { Skeleton } from '../ui/skeleton'
import { useLogoutMutation } from '@/hooks/mutations/use-logout'
import { useToken } from '@/store/use-token'
import { useQueryClient } from '@tanstack/react-query'
import { config } from '@/lib/config'

export default function Navbar() {
  const { data: user, isLoading } = useUser()
  const removeToken = useToken(state => state.removeToken)
  const queryClient = useQueryClient()
  const { mutate } = useLogoutMutation({
    onSuccess: () => {
      removeToken()
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.setQueryData(['user'], () => null)
    }
  })

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <h3 className="text-xl font-bold">SS.</h3>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <ActiveLink to="/">Home</ActiveLink>
            {user && <ActiveLink to="/dashboard">Dashboard</ActiveLink>}
          </nav>

          <div className="flex items-center gap-4">
            <ModeToggle />

            <div className="hidden md:block">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Avatar>
                        {user.profile?.profilePicture && (
                          <AvatarImage
                            src={`${config.apiUrl}/${user.profile?.profilePicture}`}
                          />
                        )}
                        <AvatarFallback className="">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="text-center">
                      {user.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button onClick={() => mutate()} className="w-full">
                        Logout
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="md:hidden">
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
                <div className="flex flex-col gap-4 p-4">
                  <ActiveLink to="/">Home</ActiveLink>
                  <Separator />
                  {user ? (
                    <>
                      <div className="flex space-x-4 items-center">
                        <Avatar>
                          <AvatarFallback>J</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">John</p>
                        </div>
                      </div>
                      <Button className="mt-2 w-full" size="sm">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" className="mt-2">
                      <Button>Login</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-6xl px-4 mx-auto">
        <Outlet />
      </main>
    </>
  )
}

export function ActiveLink({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & NavLinkProps) {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        cn(
          'transition-colors',
          isActive
            ? 'text-gray-900 dark:text-gray-50 font-medium'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
          className
        )
      }
    >
      {children}
    </NavLink>
  )
}
