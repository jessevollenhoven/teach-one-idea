import { Tutorial } from "../components/tutorial";
import { lesson } from "../lib/lesson";

export default function Home() {
  return <Tutorial lesson={lesson} />;
}
