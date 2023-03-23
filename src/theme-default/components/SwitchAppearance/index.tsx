import React from "react";
import { toggle } from "../../logic/toggleAppearance";
import styles from "./index.module.scss";

interface SwitchProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Switch(props: SwitchProps) {
  const { children, onClick, className = "" } = props;
  return (
    <button
      className={`${styles.switch} ${className}`}
      type="button"
      /* role="switch" */
      onClick={onClick}
    >
      <span className={styles.check}>
        <span className={styles.icon}>{children}</span>
      </span>
    </button>
  );
}

export function SwitchAppearance() {
  return (
    <Switch onClick={toggle}>
      {/* 图标：默认 opacity 均为 0 */}
      <div className={styles.sun}>
        <div className="i-carbon-sun" w="full" h="full"></div>
      </div>
      <div className={styles.moon}>
        <div className="i-carbon-moon" w="full" h="full"></div>
      </div>
    </Switch>
  );
}
