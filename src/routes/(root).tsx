import { Title } from "@solidjs/meta";
import { type ParentProps } from "solid-js";

export default function Layout(props: ParentProps) {
  return (
    <>
      <Title>SolidChat</Title>
      <main class="min-h-screen bg-neutral-200 text-neutral-700">
        {props.children}
      </main>
    </>
  );
}
