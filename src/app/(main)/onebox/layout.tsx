export const metadata = {
  title: 'Onebox - ReachInbox',
  description: 'Your AI driven cold outreach assistant',
};

export default function OneboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
