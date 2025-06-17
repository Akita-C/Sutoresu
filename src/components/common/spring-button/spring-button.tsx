import { PropsWithChildren } from "react";
import { Button } from "../../ui/button";
import styles from "./spring-button.module.css";

export default function SpringButton({ children }: PropsWithChildren) {
  return <Button className={styles.springButton}>{children}</Button>;
}
