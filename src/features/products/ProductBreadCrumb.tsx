import { Breadcrumb } from "antd"

type TProductBreadCrumbProps = {
  title: string
}

function ProductBreadCrumb({ title }: TProductBreadCrumbProps) {
  return (
    <Breadcrumb
      style={{ margin: "16px 0" }}
      items={[
        {
          title: "Ürünler",
          href: "/products",
        },
        {
          title,
        },
      ]}
    />
  )
}

export default ProductBreadCrumb
