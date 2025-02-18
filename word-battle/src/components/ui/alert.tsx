import React from "react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const baseStyles = "p-4 rounded-lg border text-sm";
  const variantStyles = {
    default: "bg-gray-50 border-gray-200 text-gray-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = "",
}) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};
