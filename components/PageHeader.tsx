import Breadcrumb, { type BreadcrumbItem } from "@/components/Breadcrumb";

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function PageHeader({ breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-6">
      <Breadcrumb items={breadcrumbs} />
    </div>
  );
}
