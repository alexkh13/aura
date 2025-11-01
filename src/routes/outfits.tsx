import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/outfits')({ component: OutfitsLayout })

function OutfitsLayout() {
  return <Outlet />
}
