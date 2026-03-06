import { StyleSheet, Text, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

import { useCategories } from "@/hooks/useCategories";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/locales/i18n";
import { CategoryTotal } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatCurrency";

interface DonutChartProps {
  data: CategoryTotal[];
  total: number;
  currency: string;
  size?: number;
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  // Clamp to avoid full-circle issues
  const sweep = Math.min(endAngle - startAngle, 359.999);
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((startAngle + sweep - 90) * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArc = sweep > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export function DonutChart({
  data,
  total,
  currency,
  size = 200,
}: DonutChartProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { getCategory } = useCategories();
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - 40) / 2;
  const strokeWidth = 28;

  let currentAngle = 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.length === 0 ? (
          <Path
            d={describeArc(cx, cy, radius, 0, 359.999)}
            stroke={theme.backgroundElement}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <G>
            {data.map((item) => {
              const angle = (item.percentage / 100) * 360;
              if (angle < 0.5) return null;
              const gap = data.length > 1 ? 3 : 0;
              const path = describeArc(
                cx,
                cy,
                radius,
                currentAngle + gap / 2,
                currentAngle + angle - gap / 2,
              );
              currentAngle += angle;

              return (
                <Path
                  key={item.key}
                  d={path}
                  stroke={getCategory(item.key).color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        )}
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.centerAmount, { color: theme.text }]}>
          {formatCurrency(total, currency)}
        </Text>
        <Text style={[styles.centerLabel, { color: theme.textSecondary }]}>
          {t('chart.total')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  centerAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  centerLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
});
