import { AppSidebar } from "@/components/app-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  return (
    <div className="flex flex-row">
      <AppSidebar />
      <main className="w-full h-full overflow-hidden">
        {props.children}
      </main>
    </div>
  )
}
