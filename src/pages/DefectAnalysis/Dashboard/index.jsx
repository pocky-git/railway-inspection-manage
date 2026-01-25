import { useMemo } from "react";
import {
  PageContainer,
  ProCard,
  QueryFilter,
  ProFormDateRangePicker,
} from "@ant-design/pro-components";
import { Progress, Button } from "antd";
import { Bar, Gauge } from "@ant-design/plots";
import styles from "./index.module.less";
import RiskHeatMap from "./RiskHeatMap";

const DefectAnalysisDashboard = () => {
  const defectTypeBarConfig = useMemo(
    () => ({
      data: [
        {
          labelName: "裂缝",
          value: 110,
        },
        {
          labelName: "剥落",
          value: 220,
        },
        {
          labelName: "漏筋",
          value: 330,
        },
        {
          labelName: "空洞",
          value: 440,
        },
      ],
      xField: "labelName",
      yField: "value",
      colorField: "labelName",
      paddingRight: 80,
      style: {
        maxWidth: 25,
      },
      markBackground: {
        label: {
          text: ({ originData }) => {
            return `${(originData.value / 1000) * 100}% | ${originData.value}`;
          },
          position: "right",
          dx: 80,
          style: {
            fill: "#aaa",
            fillOpacity: 1,
            fontSize: 14,
          },
        },
        style: {
          fill: "#eee",
        },
      },
      scale: {
        y: {
          domain: [0, 1000],
        },
      },
      axis: {
        x: {
          tick: false,
          title: false,
        },
        y: {
          grid: false,
          tick: false,
          label: false,
          title: false,
        },
      },
      interaction: {
        elementHighlight: false,
      },
    }),
    [],
  );

  return (
    <PageContainer
      header={{
        title: "仪表盘",
        ghost: true,
        breadcrumb: {
          items: [
            {
              path: "/defect-analysis/overview",
              title: "缺陷（病害）分析",
            },
            {
              title: "仪表盘",
            },
          ],
        },
      }}
      extra={<Button type="primary">导出报表</Button>}
    >
      <QueryFilter>
        <ProFormDateRangePicker name="dateRange" label="时间范围" />
      </QueryFilter>
      <ProCard gutter={[8, 8]} ghost wrap>
        <ProCard
          colSpan={8}
          layout="center"
          variant="outlined"
          title="分析进度"
          className={styles.progressCard}
        >
          <Progress
            type="circle"
            percent={45}
            format={(percent) => (
              <>
                <div>{percent}%</div>
                <div className={styles.progressDesc}>100/200</div>
              </>
            )}
          />
        </ProCard>
        <ProCard
          colSpan={8}
          layout="center"
          variant="outlined"
          direction="column"
          title="处理速度"
          className={styles.progressCard}
        >
          <Gauge
            data={{
              target: 120,
              total: 400,
            }}
            style={{
              textContent: (target) => `${target} 张/分钟`,
              textFontSize: 14,
              textFill: "#000",
              textFillOpacity: 0.45,
            }}
          />
        </ProCard>
        <ProCard
          colSpan={8}
          layout="center"
          variant="outlined"
          title="资源使用（CPU）"
          className={styles.progressCard}
        >
          <Progress type="circle" percent={75} />
        </ProCard>
        <ProCard
          colSpan={24}
          layout="center"
          variant="outlined"
          title="病害类型分布"
          className={styles.barCard}
        >
          <Bar {...defectTypeBarConfig} />
        </ProCard>
        <ProCard
          colSpan={24}
          layout="center"
          variant="outlined"
          title="高风险区域热力图"
          className={styles.hotCard}
        >
          <RiskHeatMap />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default DefectAnalysisDashboard;
