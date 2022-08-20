import { ExclamationIcon, XCircleIcon } from "@heroicons/react/outline";

const VARIANT_ICONS = {
  danger: XCircleIcon,
  warning: ExclamationIcon,
};

const VARIANT_BACKGROUND_COLOR = {
  danger: "bg-red-100",
  warning: "bg-yellow-50",
};

const VARIANT_ICON_CLASS = {
  danger: "text-red-400",
  warning: "text-yellow-400",
};

const VARIANT_TITLE_CLASS = {
  danger: "text-red-800",
  warning: "text-yellow-800",
};

const VARIANT_BODY_CLASS = {
  danger: "text-red-700",
  warning: "text-yellow-700",
};

export function Alert({
  variant,
  title,
  body,
  className,
}: {
  variant: "danger" | "warning";
  title?: string;
  body?: string;
  className?: string;
}) {
  const VariantIcon = VARIANT_ICONS[variant];
  return (
    <div
      className={`rounded-md p-4 ${VARIANT_BACKGROUND_COLOR[variant]} ${
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
          <h3 className={`text-sm font-medium ${VARIANT_TITLE_CLASS[variant]}`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ${VARIANT_BODY_CLASS[variant]}`}>
            <p>{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
