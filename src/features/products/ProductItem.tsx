import { Flex, Typography } from "antd"

type TProductItemProps = {
  label: string
  children: React.ReactNode
}

function ProductItem({ label, children }: TProductItemProps) {
  return (
    <Flex wrap="wrap" gap={6} style={{ marginBottom: 4 }}>
      <Typography.Text strong style={{ width: "72px" }}>
        {label}:{" "}
      </Typography.Text>
      <Typography.Text>{children}</Typography.Text>
    </Flex>
  )
}

export default ProductItem
