import '../globals.css';

export const metadata = {
  title: 'Login - ReachInbox',
  description: 'This is the login page for ReachInbox.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
