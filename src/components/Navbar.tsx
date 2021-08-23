interface NavbarProps {
  account: string
}

export function Navbar(props: NavbarProps) {
  const { account } = props;

  return <div className="Navbar">
    {account}
  </div>
}