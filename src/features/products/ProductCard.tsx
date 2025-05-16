import { Flex, Spin, theme, Typography } from "antd"

import styles from "./Product.module.css"

type TProductCardProps = {
  isLoading?: boolean
  title: string
  description?: string
  children: React.ReactNode
}

function ProductCard({
  isLoading = false,
  title = "",
  description,
  children,
}: TProductCardProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  return (
    <div
      className={styles.productCard}
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {isLoading ? (
        <div className={styles.productCardSpinner}>
          <Spin />
        </div>
      ) : (
        <Flex vertical gap={12} wrap="wrap">
          {title && (
            <Flex vertical wrap="wrap">
              <Typography.Title level={5} className={styles.m0}>
                {title}
              </Typography.Title>
              {description && (
                <Typography.Text type="secondary">
                  {description}
                </Typography.Text>
              )}
            </Flex>
          )}
          <Flex vertical wrap="wrap">
            {children}
          </Flex>
        </Flex>
      )}
    </div>
  )
}

export default ProductCard
