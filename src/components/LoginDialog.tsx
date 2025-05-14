import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'

type LoginDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const LoginDialog = ({ isOpen, onClose, onSuccess }: LoginDialogProps) => {
  const { login, isLoading } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phone || !password) {
      setError('Please fill in all fields')
      return
    }

    // Simple validation for phone number - expecting at least 10 digits
    const phoneRegex = /^\d{10,}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (at least 10 digits)')
      return
    }

    // Perform login
    const success = await login(phone, password)

    if (success) {
      onClose()

      if (onSuccess) {
        onSuccess()
      }
    } else {
      // Error is already handled in the store with toast
      setError(useAuthStore.getState().error || 'Login failed')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log in to your account</DialogTitle>
          <DialogDescription>Please log in to continue to checkout</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
