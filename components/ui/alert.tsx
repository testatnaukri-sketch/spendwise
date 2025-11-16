import React from "react";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = "info", children, className = "" }: AlertProps) {
  const styles = {
    success: "bg-green-50 text-green-800 border-green-300",
    error: "bg-red-50 text-red-800 border-red-300",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-300",
    info: "bg-blue-50 text-blue-800 border-blue-300",
  };

  return (
    <div
      className={`p-4 rounded-md border ${styles[type]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
