import { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import styles from "./index.module.less";

// 高风险区域热力图组件 - 使用Canvas实现
const RiskHeatmap = () => {
  const canvasRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState(500); // 默认显示500km
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 200 });
  const devicePixelRatio = window.devicePixelRatio || 1;

  // 风险区域数据 - 使用实际的公里数，而不是固定位置
  const riskAreas = [
    {
      id: 1,
      startKm: 80,
      endKm: 130,
      start: "K80",
      end: "K130",
      level: "high",
      color: "#ff4d4f",
      textColor: "#ff4d4f",
      opacity: 0.6,
    },
    {
      id: 2,
      startKm: 280,
      endKm: 295,
      start: "K280",
      end: "K295",
      level: "medium",
      color: "#faad14",
      textColor: "#faad14",
      opacity: 0.6,
    },
    {
      id: 3,
      startKm: 450,
      endKm: 460,
      start: "K450",
      end: "K460",
      level: "high",
      color: "#ff4d4f",
      textColor: "#ff4d4f",
      opacity: 0.6,
    },
    // 更多风险区域示例
    {
      id: 4,
      startKm: 580,
      endKm: 590,
      start: "K580",
      end: "K590",
      level: "medium",
      color: "#faad14",
      textColor: "#faad14",
      opacity: 0.6,
    },
    {
      id: 5,
      startKm: 780,
      endKm: 790,
      start: "K780",
      end: "K790",
      level: "high",
      color: "#ff4d4f",
      textColor: "#ff4d4f",
      opacity: 0.6,
    },
    {
      id: 6,
      startKm: 900,
      endKm: 910,
      start: "K900",
      end: "K910",
      level: "medium",
      color: "#faad14",
      textColor: "#faad14",
      opacity: 0.6,
    },
  ];

  // 处理缩放 - 调整显示的铁路线范围
  const handleZoomIn = () => {
    // 放大：显示更少的公里数，看到更详细的风险区域
    setVisibleRange((prev) => Math.max(prev - 50, 50));
  };

  const handleZoomOut = () => {
    // 缩小：显示更多的公里数，看到更多的风险区域
    setVisibleRange((prev) => Math.min(prev + 50, 1000));
  };

  // 设置Canvas尺寸和高清显示
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        // 获取容器尺寸，调整内边距和边框
        const rect = containerRef.current.getBoundingClientRect();
        // 减去内边距，确保canvas内容显示完整
        const newSize = {
          width: rect.width, // 至少600px宽度
          height: rect.height, // 减去顶部控制区域的高度
        };
        setCanvasSize(newSize);

        // 设置Canvas高清显示
        const canvas = canvasRef.current;
        if (canvas) {
          // 调整Canvas实际尺寸以匹配设备像素比
          canvas.width = newSize.width * devicePixelRatio;
          canvas.height = newSize.height * devicePixelRatio;

          // 设置CSS尺寸
          canvas.style.width = `${newSize.width}px`;
          canvas.style.height = `${newSize.height}px`;

          // 获取上下文并设置缩放因子
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // 重置上下文状态
            ctx.restore();
            ctx.save();
            // 设置缩放因子
            ctx.scale(devicePixelRatio, devicePixelRatio);
          }
        }
      }
    };

    // 确保DOM渲染完成后再获取尺寸
    const timer = setTimeout(updateCanvasSize, 0);
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [devicePixelRatio]);

  // 绘制铁路线和风险区域
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(
      0,
      0,
      canvas.width / devicePixelRatio,
      canvas.height / devicePixelRatio,
    );

    // 计算铁路线位置
    const railY = canvas.height / devicePixelRatio / 2;
    const railHeight = 4;
    const railColor = "#999";

    // 显示范围：默认从K100开始，根据visibleRange调整
    const startKm = 0;
    const endKm = startKm + visibleRange;

    // 计算每公里在Canvas上的像素数
    const pixelsPerKm = canvas.width / devicePixelRatio / visibleRange;

    // 绘制铁路线
    ctx.fillStyle = railColor;
    ctx.fillRect(
      0,
      railY - railHeight / 2,
      canvas.width / devicePixelRatio,
      railHeight,
    );

    // 绘制风险区域
    riskAreas.forEach((area) => {
      // 检查风险区域是否在当前显示范围内
      if (area.endKm < startKm || area.startKm > endKm) {
        return; // 不在范围内，跳过绘制
      }

      const {
        startKm: areaStart,
        endKm: areaEnd,
        color,
        textColor,
        opacity,
        start,
        end,
        level,
      } = area;

      // 计算风险区域在Canvas上的位置和尺寸
      const riskX = Math.max(0, (areaStart - startKm) * pixelsPerKm);
      const riskWidth = Math.max(10, (areaEnd - areaStart) * pixelsPerKm);
      const riskHeight = 60;
      const riskY = railY - riskHeight / 2;

      // 绘制风险区域背景
      ctx.fillStyle =
        color +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.fillRect(riskX, riskY, riskWidth, riskHeight);

      // 绘制风险区域边框
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(riskX, riskY, riskWidth, riskHeight);

      // 绘制风险区域标签
      const label = `${start}-${end} ${level === "high" ? "高风险" : "中风险"}`;
      const labelX = riskX + riskWidth / 2;
      const labelY = riskY - 20;

      // 绘制标签背景
      ctx.fillStyle = color;
      ctx.fillRect(labelX - 80, labelY - 15, 160, 30);

      // 绘制标签文字
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, labelX, labelY);
    });
  }, [visibleRange, canvasSize, riskAreas, devicePixelRatio]);

  return (
    <div className={styles.riskHeatmapCanvasContainer} ref={containerRef}>
      <div className={styles.zoomControls}>
        <div className={styles.zoomControl} onClick={handleZoomIn}>
          <PlusOutlined />
        </div>
        <div className={styles.zoomControl} onClick={handleZoomOut}>
          <MinusOutlined />
        </div>
      </div>

      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      {/* 图例 */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: "#ff4d4f" }}
          />
          <span>高风险区域</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: "#faad14" }}
          />
          <span>中风险区域</span>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
