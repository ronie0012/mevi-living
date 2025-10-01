import { Metadata } from 'next'
import AccountClient from './account-client'

export const metadata: Metadata = {
  title: "My Account - Mevi Living",
  description: "Manage your Mevi Living account",
}

export default function AccountPage() {
  return <AccountClient />
}
