import { Button } from "@/src/shared/ui/button/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>H1</h1>
      <h2>H2</h2>
      <Button variant='primary'>Button</Button>
      <Button variant='secondary'>Button</Button>
      <Button variant='disabled'>Button</Button>
      <Button variant='green'>Button</Button>
      <Button variant='red'>Button</Button>
      <Link href='/registration'>Registration</Link>
      <Link href='/login'>Login</Link>
    </div>
  );
}
