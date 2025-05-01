import { Github, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialSignup() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="icon" className="w-full">
          <Github className="h-4 w-4" />
          <span className="sr-only">GitHub</span>
        </Button>
        <Button variant="outline" size="icon" className="w-full">
          <Twitter className="h-4 w-4" />
          <span className="sr-only">Twitter</span>
        </Button>
        <Button variant="outline" size="icon" className="w-full">
          <Facebook className="h-4 w-4" />
          <span className="sr-only">Facebook</span>
        </Button>
      </div>
    </div>
  )
}
