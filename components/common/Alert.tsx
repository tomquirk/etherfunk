import {
  CheckCircleIcon,
  ExclamationIcon,
  XCircleIcon,
} from "@heroicons/react/outline";

const VARIANT_ICONS = {
  danger: XCircleIcon,
  warning: ExclamationIcon,
  success: CheckCircleIcon,
};

const VARIANT_WRAPPER_CLASS = {
  danger: "bg-red-100 border border-red-600",
  warning: "bg-yellow-50 border border-yellow-500",
  success: "bg-green-100 border border-green-600",
};

const VARIANT_ICON_CLASS = {
  danger: "text-red-500",
  warning: "text-yellow-500",
  success: "text-green-600",
};

const VARIANT_TITLE_CLASS = {
  danger: "text-red-800",
  warning: "text-yellow-800",
  success: "text-green-900",
};

const VARIANT_BODY_CLASS = {
  danger: "text-red-700",
  warning: "text-yellow-700",
  success: "text-green-800",
};

export function Alert({
  variant,
  title,
  body,
  className,
}: {
  variant: "danger" | "warning" | "success";
  title?: string;
  body?: string | JSX.Element;
  className?: string;
}) {
  const VariantIcon = VARIANT_ICONS[variant];
  return (
    <div
      className={`rounded-md p-4 ${VARIANT_WRAPPER_CLASS[variant]} ${
        className ?? ""
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <VariantIcon
            className={`'h-5 w-5 ${VARIANT_ICON_CLASS[variant]}`}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 overflow-hidden">
          <span
            className={`text-sm font-medium ${VARIANT_TITLE_CLASS[variant]}`}
          >
            {title}
          </span>
          <div className={`mt-2 text-sm ${VARIANT_BODY_CLASS[variant]}`}>
            <p>{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
