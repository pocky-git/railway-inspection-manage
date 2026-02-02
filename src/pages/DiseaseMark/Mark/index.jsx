import { useState, useRef, useEffect } from "react";
import {
  Input,
  message,
  List,
  Tag,
  Badge,
  Button,
  Tooltip,
  Slider,
  Popconfirm,
  Spin,
} from "antd";
import { SaveOutlined, UndoOutlined, RedoOutlined } from "@ant-design/icons";
import { useThrottleFn } from "ahooks";
import VirtualList from "@rc-component/virtual-list";
import { SHAPE_TYPE } from "./constants";
import styles from "./index.module.less";

const mockImageList = new Array(50).fill(0).map((_, index) => ({
  id: index + 1,
  thumbUrl: "http://121.33.195.138:88/images/test/bridge/2222.JPG?w=200",
  url:
    "http://121.33.195.138:88/images/test/bridge/2222.JPG?q=20&t=" +
    Math.random(),
  name: `图片${index + 1}`,
}));

const DiseaseMark = () => {
  // 状态管理
  const [imageList, setImageList] = useState(mockImageList);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(mockImageList[0].url);
  const [annotations, setAnnotations] = useState({}); // 改为对象，key为图片id
  const [currentAnnotations, setCurrentAnnotations] = useState([]); // 当前图片的标注
  const [annotationType, setAnnotationType] = useState(""); // rectangle 或 polygon
  const [currentAnnotation, setCurrentAnnotation] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [diseaseType, setDiseaseType] = useState("");
  const [diseaseRemark, setDiseaseRemark] = useState("");
  const [zoom, setZoom] = useState(100);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [undoStack, setUndoStack] = useState([]); // 撤销栈
  const [redoStack, setRedoStack] = useState([]); // 复原栈
  const [annotationMethod, setAnnotationMethod] = useState(1);
  const [imageVirtualListHeight, setImageVirtualListHeight] = useState(0);
  const [loadingData, setLoadingData] = useState({
    spinning: false,
  });
  // Canvas尺寸状态
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  });
  const devicePixelRatio = window.devicePixelRatio || 1;

  // 引用
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const imageListRef = useRef(null);

  // 缩放功能
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 1000));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 10));
  };

  // 使用ahooks的useThrottleFn创建节流后的缩放函数
  const { run: throttledZoom } = useThrottleFn(
    (deltaY) => {
      if (deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    },
    {
      wait: 10, // 50ms节流时间，比之前的100ms更短
    },
  );

  // 病害类型数据
  const diseaseTypes = [
    { value: "crack", label: "裂缝", color: "#ff4d4f" },
    { value: "rust", label: "锈蚀", color: "#faad14" },
    { value: "deformation", label: "变形", color: "#1890ff" },
    { value: "spalling", label: "剥落", color: "#52c41a" },
    { value: "other", label: "其他", color: "#722ed1" },
  ];

  // 切换图片
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    const currentImage = imageList[index];
    setImageUrl(currentImage.url);
    // 加载对应图片的标注
    const imgAnnotations = annotations[currentImage.id] || [];
    setCurrentAnnotations(imgAnnotations);
    // 重置图片偏移
    setImageOffset({ x: 0, y: 0 });
    // 切换图片时重置撤销和复原栈
    setUndoStack([]);
    setRedoStack([]);
  };

  // 鼠标按下事件 - 开始拖拽
  const handleMouseDownForDrag = (e) => {
    // 只有在非绘制状态下且未选择标注类型时才能拖拽
    if (isDrawing || annotationType) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 检查点击位置是否在图片上
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算图片绘制区域
    const scaleFactor = zoom / 100;
    const scaledImageWidth = imageWidth * scaleFactor;
    const scaledImageHeight = imageHeight * scaleFactor;
    const imageX = (canvasSize.width - scaledImageWidth) / 2 + imageOffset.x;
    const imageY = (canvasSize.height - scaledImageHeight) / 2 + imageOffset.y;

    // 检查点击位置是否在图片范围内
    if (
      x >= imageX &&
      x <= imageX + scaledImageWidth &&
      y >= imageY &&
      y <= imageY + scaledImageHeight
    ) {
      setIsDragging(true);
      setDragStart({ x, y });
      // 改变鼠标样式
      canvas.style.cursor = "grabbing";
    }
  };

  // 鼠标移动事件 - 拖拽中
  const handleMouseMoveForDrag = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算偏移量
    const offsetX = x - dragStart.x;
    const offsetY = y - dragStart.y;

    // 更新图片偏移
    setImageOffset((prev) => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY,
    }));

    // 更新拖拽起始位置
    setDragStart({ x, y });
  };

  // 鼠标释放事件 - 结束拖拽
  const handleMouseUpForDrag = () => {
    if (isDragging) {
      setIsDragging(false);
      // 恢复鼠标样式
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = "crosshair";
      }
    }
  };

  // 绘制标注
  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 获取CSS尺寸（实际显示尺寸）
    const cssWidth = canvasSize.width;
    const cssHeight = canvasSize.height;

    // 清空画布（使用高清尺寸）
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // 设置背景色
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // 计算图片绘制参数
    const scaleFactor = zoom / 100;
    const scaledImageWidth = imageWidth * scaleFactor;
    const scaledImageHeight = imageHeight * scaleFactor;

    // 图片居中显示（使用CSS尺寸计算）
    const centerX = (cssWidth - scaledImageWidth) / 2;
    const centerY = (cssHeight - scaledImageHeight) / 2;

    // 应用拖拽偏移
    const imageX = centerX + imageOffset.x;
    const imageY = centerY + imageOffset.y;

    // 绘制图片
    if (imageRef.current) {
      ctx.drawImage(
        imageRef.current,
        imageX,
        imageY,
        scaledImageWidth,
        scaledImageHeight,
      );
    }

    // 绘制当前正在绘制的标注
    if (isDrawing) {
      ctx.strokeStyle = "#1890ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // 虚线
      ctx.fillStyle = "rgba(24, 144, 255, 0.1)";

      if (annotationType === SHAPE_TYPE.RECTANGLE) {
        // 绘制矩形
        ctx.strokeRect(
          currentAnnotation.x,
          currentAnnotation.y,
          currentAnnotation.width,
          currentAnnotation.height,
        );
      } else {
        // 绘制多边形
        if (polygonPoints.length > 0) {
          ctx.beginPath();
          ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);

          // 绘制多边形边
          for (let i = 1; i < polygonPoints.length; i++) {
            ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
          }

          // 如果有两个或更多点，绘制最后一个点到鼠标位置的临时线
          if (polygonPoints.length > 1) {
            ctx.lineTo(currentAnnotation.x, currentAnnotation.y);
          }

          ctx.stroke();
          ctx.fill();

          // 绘制多边形顶点
          polygonPoints.forEach((point) => {
            ctx.fillStyle = "#1890ff";
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(24, 144, 255, 0.1)";
          });
        }
      }

      ctx.setLineDash([]); // 恢复实线
    }

    // 绘制已保存的标注
    currentAnnotations.forEach((annotation) => {
      const typeInfo =
        diseaseTypes.find((t) => t.value === annotation.type) ||
        diseaseTypes[diseaseTypes.length - 1];

      ctx.strokeStyle = typeInfo.color;
      ctx.lineWidth = 2;
      ctx.fillStyle = typeInfo.color + "1A"; // 10%透明度

      // 统一使用points数组绘制标注，无论是多边形还是矩形
      if (annotation.points && annotation.points.length > 0) {
        ctx.beginPath();
        // 应用缩放和偏移绘制
        ctx.moveTo(
          imageX + annotation.points[0].x * scaleFactor,
          imageY + annotation.points[0].y * scaleFactor,
        );

        for (let i = 1; i < annotation.points.length; i++) {
          ctx.lineTo(
            imageX + annotation.points[i].x * scaleFactor,
            imageY + annotation.points[i].y * scaleFactor,
          );
        }

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // 绘制顶点
        annotation.points.forEach((point) => {
          ctx.fillStyle = typeInfo.color;
          ctx.beginPath();
          ctx.arc(
            imageX + point.x * scaleFactor,
            imageY + point.y * scaleFactor,
            3,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        });
      }

      // 绘制标注信息背景，统一使用points数组获取起始位置
      const labelX = imageX + annotation.points?.[0]?.x * scaleFactor;
      const labelY = imageY + annotation.points?.[0]?.y * scaleFactor;

      ctx.fillStyle = typeInfo.color + "CC"; // 添加透明度
      ctx.fillRect(labelX, labelY - 25, 120, 25);

      // 绘制标注信息文字
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`${typeInfo.label}`, labelX + 5, labelY - 12);
    });
  };

  // 检查坐标是否在图片范围内
  const isPointInImageBounds = (canvasX, canvasY) => {
    const scaleFactor = zoom / 100;
    const scaledImageWidth = imageWidth * scaleFactor;
    const scaledImageHeight = imageHeight * scaleFactor;
    const centerX = (canvasSize.width - scaledImageWidth) / 2;
    const centerY = (canvasSize.height - scaledImageHeight) / 2;
    const imageX = centerX + imageOffset.x;
    const imageY = centerY + imageOffset.y;

    return (
      canvasX >= imageX &&
      canvasX <= imageX + scaledImageWidth &&
      canvasY >= imageY &&
      canvasY <= imageY + scaledImageHeight
    );
  };

  // 转换鼠标坐标到实际图片坐标
  const getImageCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    // 计算实际点击位置在Canvas上的坐标
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    return { x: canvasX, y: canvasY };
  };

  // 鼠标按下事件 - 开始绘制或添加多边形顶点
  const handleMouseDown = (e) => {
    if (!imageUrl) return;

    // 如果没有选择标注类型，不触发绘制
    if (!annotationType) return;

    const { x, y } = getImageCoordinates(e);

    if (annotationType === SHAPE_TYPE.RECTANGLE) {
      // 矩形模式 - 开始绘制
      setCurrentAnnotation({ x, y, width: 0, height: 0 });
      setIsDrawing(true);
    } else if (annotationType === SHAPE_TYPE.POLYGON) {
      // 检查点击位置是否在图片范围内
      if (!isPointInImageBounds(x, y)) {
        message.warning("请在图片范围内添加多边形顶点");
        return;
      }

      // 多边形模式 - 添加顶点
      if (!isDrawing) {
        // 开始绘制多边形
        setPolygonPoints([{ x, y }]);
        setIsDrawing(true);
      } else {
        // 添加新顶点
        setPolygonPoints((prev) => [...prev, { x, y }]);
      }
      // 更新当前鼠标位置用于绘制临时线
      setCurrentAnnotation({ x, y, width: 0, height: 0 });
    }
  };

  // 鼠标移动事件 - 绘制中
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { x, y } = getImageCoordinates(e);

    if (annotationType === SHAPE_TYPE.RECTANGLE) {
      // 矩形模式 - 更新矩形尺寸
      setCurrentAnnotation((prev) => ({
        ...prev,
        width: x - prev.x,
        height: y - prev.y,
      }));
    } else {
      // 多边形模式 - 更新当前鼠标位置用于绘制临时线
      setCurrentAnnotation({ x, y, width: 0, height: 0 });
    }
  };

  // 鼠标释放事件 - 结束绘制
  const handleMouseUp = () => {
    if (!isDrawing || annotationType !== SHAPE_TYPE.RECTANGLE) return;

    // 矩形模式 - 结束绘制
    setIsDrawing(false);

    const { x, y, width, height } = currentAnnotation;
    const scaleFactor = zoom / 100;

    // 确保标注有效（最小尺寸10x10，考虑缩放）
    if (Math.abs(width) > 10 && Math.abs(height) > 10) {
      // 计算矩形在图片上的实际位置
      const rectStartX = width > 0 ? x : x + width;
      const rectStartY = height > 0 ? y : y + height;
      const rectWidth = Math.abs(width);
      const rectHeight = Math.abs(height);

      // 计算图片在Canvas上的实际位置（考虑居中偏移和拖拽偏移）
      const scaledImageWidth = imageWidth * scaleFactor;
      const scaledImageHeight = imageHeight * scaleFactor;
      const centerX = (canvasSize.width - scaledImageWidth) / 2;
      const centerY = (canvasSize.height - scaledImageHeight) / 2;
      const actualImageX = centerX + imageOffset.x;
      const actualImageY = centerY + imageOffset.y;

      // 转换为相对于图片的坐标
      const relativeX = (rectStartX - actualImageX) / scaleFactor;
      const relativeY = (rectStartY - actualImageY) / scaleFactor;
      const relativeWidth = rectWidth / scaleFactor;
      const relativeHeight = rectHeight / scaleFactor;

      // 确保标注在图片范围内
      if (
        relativeX >= 0 &&
        relativeY >= 0 &&
        relativeX + relativeWidth <= imageWidth &&
        relativeY + relativeHeight <= imageHeight
      ) {
        // 矩形标注使用points数组表示，与多边形格式完全一致
        const newAnnotation = {
          id: Date.now(),
          shape: SHAPE_TYPE.RECTANGLE,
          points: [
            { x: relativeX, y: relativeY }, // 左上角
            { x: relativeX + relativeWidth, y: relativeY }, // 右上角
            { x: relativeX + relativeWidth, y: relativeY + relativeHeight }, // 右下角
            { x: relativeX, y: relativeY + relativeHeight }, // 左下角
          ],
          type: diseaseType || "other",
          name: diseaseRemark || "无备注",
          createdAt: new Date().toISOString(),
        };

        // 添加标注前保存当前状态到撤销栈
        setUndoStack((prev) => [...prev, currentAnnotations]);
        // 清空复原栈，因为有了新操作
        setRedoStack([]);

        setCurrentAnnotations((prev) => [...prev, newAnnotation]);
        // 标注完成后清空标注类型，允许拖拽图片
        setAnnotationType("");
      } else {
        message.warning("标注必须在图片范围内");
      }
    }
  };

  // 鼠标双击事件 - 完成多边形绘制
  const handleDoubleClick = () => {
    if (!isDrawing || annotationType !== SHAPE_TYPE.POLYGON) return;

    // 多边形模式 - 结束绘制
    if (polygonPoints.length < 3) {
      message.warning("多边形至少需要3个顶点");
      return;
    }

    setIsDrawing(false);

    const scaleFactor = zoom / 100;

    // 计算图片在Canvas上的实际位置（考虑居中偏移和拖拽偏移）
    const scaledImageWidth = imageWidth * scaleFactor;
    const scaledImageHeight = imageHeight * scaleFactor;
    const centerX = (canvasSize.width - scaledImageWidth) / 2;
    const centerY = (canvasSize.height - scaledImageHeight) / 2;
    const actualImageX = centerX + imageOffset.x;
    const actualImageY = centerY + imageOffset.y;

    // 转换多边形顶点为原始图片坐标，并确保它们在图片范围内
    const originalPoints = polygonPoints.map((point) => {
      // 计算原始图片坐标
      let x = (point.x - actualImageX) / scaleFactor;
      let y = (point.y - actualImageY) / scaleFactor;

      // 确保坐标在图片范围内
      x = Math.max(0, Math.min(x, imageWidth));
      y = Math.max(0, Math.min(y, imageHeight));

      return { x, y };
    });

    const newAnnotation = {
      id: Date.now(),
      shape: SHAPE_TYPE.POLYGON,
      points: originalPoints,
      type: diseaseType || "other",
      name: diseaseRemark || "无备注",
      createdAt: new Date().toISOString(),
    };

    // 添加标注前保存当前状态到撤销栈
    setUndoStack((prev) => [...prev, currentAnnotations]);
    // 清空复原栈，因为有了新操作
    setRedoStack([]);

    setCurrentAnnotations((prev) => [...prev, newAnnotation]);
    setPolygonPoints([]);
    // 标注完成后清空标注类型，允许拖拽图片
    setAnnotationType("");
  };

  // 键盘事件处理 - 支持按Enter键完成多边形绘制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Enter" &&
        isDrawing &&
        annotationType === SHAPE_TYPE.POLYGON
      ) {
        handleDoubleClick();
      } else if (e.key === "Escape" && isDrawing) {
        // 按Escape键取消绘制
        setIsDrawing(false);
        setPolygonPoints([]);
        message.info("标注已取消");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawing, annotationType, polygonPoints]);

  // 保存标注
  const handleSave = () => {
    if (currentAnnotations.length === 0) {
      message.warning("没有可保存的标注");
      return;
    }

    const currentImage = imageList[currentImageIndex];

    // TODO 保存当前图片的标注到annotations对象中
    const newAnnotations = {
      ...annotations,
      [currentImage.id]: currentAnnotations,
    };

    // 构建标注数据
    const annotationData = {
      imageId: currentImage.id,
      annotations: currentAnnotations.map((anno) => {
        // 统一处理所有标注类型，使用points数组计算边界框和相对坐标
        return {
          ...anno,
          // 计算边界框
          boundingBox: {
            x: Math.min(...anno.points.map((p) => p.x)),
            y: Math.min(...anno.points.map((p) => p.y)),
            width:
              Math.max(...anno.points.map((p) => p.x)) -
              Math.min(...anno.points.map((p) => p.x)),
            height:
              Math.max(...anno.points.map((p) => p.y)) -
              Math.min(...anno.points.map((p) => p.y)),
          },
          // 计算相对坐标点
          relativePoints: anno.points.map((p) => ({
            x: p.x / imageWidth || 0,
            y: p.y / imageHeight || 0,
          })),
        };
      }),
    };

    // 这里可以替换为实际的保存逻辑，比如发送到后端API
    console.log("保存的标注数据:", annotationData);

    // 模拟保存成功
    message.success(`成功保存 ${currentAnnotations.length} 个标注`);
  };

  // 清除所有标注
  const handleClear = () => {
    if (currentAnnotations.length === 0) {
      message.warning("没有可清除的标注");
      return;
    }

    // 清除前保存当前状态到撤销栈
    setUndoStack((prev) => [...prev, currentAnnotations]);
    // 清空复原栈，因为有了新操作
    setRedoStack([]);
    setCurrentAnnotations([]);
    setCurrentAnnotation({ x: 0, y: 0, width: 0, height: 0 });
    setPolygonPoints([]);
    setIsDrawing(false);
    message.success("所有标注已清除");
  };

  // 删除单个标注
  const handleDeleteAnnotation = (id) => {
    // 删除前保存当前状态到撤销栈
    setUndoStack((prev) => [...prev, currentAnnotations]);
    // 清空复原栈，因为有了新操作
    setRedoStack([]);

    const updatedAnnotations = currentAnnotations.filter(
      (anno) => anno.id !== id,
    );
    setCurrentAnnotations(updatedAnnotations);
    message.success("标注已删除");
  };

  // 撤销操作
  const handleUndo = () => {
    if (undoStack.length === 0) {
      message.warning("没有可撤销的操作");
      return;
    }

    // 获取撤销前的状态
    const previousAnnotations = undoStack[undoStack.length - 1];
    // 保存当前状态到复原栈
    setRedoStack((prev) => [...prev, currentAnnotations]);
    // 从撤销栈中移除最后一个状态
    setUndoStack((prev) => prev.slice(0, -1));
    // 恢复到撤销前的状态
    setCurrentAnnotations(previousAnnotations);

    message.success("撤销成功");
  };

  // 复原操作
  const handleRedo = () => {
    if (redoStack.length === 0) {
      message.warning("没有可复原的操作");
      return;
    }

    // 获取复原后的状态
    const nextAnnotations = redoStack[redoStack.length - 1];
    // 保存当前状态到撤销栈
    setUndoStack((prev) => [...prev, currentAnnotations]);
    // 从复原栈中移除最后一个状态
    setRedoStack((prev) => prev.slice(0, -1));
    // 恢复到复原后的状态
    setCurrentAnnotations(nextAnnotations);

    message.success("复原成功");
  };

  // 设置Canvas高清显示
  const setupHighDpiCanvas = (canvas, width, height) => {
    // 根据设备像素比调整Canvas尺寸
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // 设置CSS尺寸
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 获取上下文并缩放
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // 开启抗锯齿
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      // 设置缩放因子
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  };

  // 标注方法切换时处理
  const handleAnnotationMethodChange = (value) => {
    // TODO 需要换成请求api获取annotions
    let newAnnotations = [];
    if (value === 2) {
      newAnnotations = {
        1: [
          {
            id: 1769271495879,
            shape: SHAPE_TYPE.RECTANGLE,
            points: [
              {
                x: 45,
                y: 42,
              },
              {
                x: 194,
                y: 42,
              },
              {
                x: 194,
                y: 223,
              },
              {
                x: 45,
                y: 223,
              },
            ],
            type: "other",
            name: "无备注",
            createdAt: "2026-01-24T16:18:15.879Z",
            boundingBox: {
              x: 45,
              y: 42,
              width: 149,
              height: 181,
            },
            relativePoints: [
              {
                x: 0.09,
                y: 0.084,
              },
              {
                x: 0.388,
                y: 0.084,
              },
              {
                x: 0.388,
                y: 0.446,
              },
              {
                x: 0.09,
                y: 0.446,
              },
            ],
          },
          {
            id: 1769271502898,
            shape: SHAPE_TYPE.POLYGON,
            points: [
              {
                x: 239,
                y: 179,
              },
              {
                x: 419,
                y: 219,
              },
              {
                x: 360,
                y: 369,
              },
              {
                x: 236,
                y: 381,
              },
              {
                x: 174,
                y: 320,
              },
              {
                x: 193,
                y: 276,
              },
            ],
            type: "rust",
            name: "无备注",
            createdAt: "2026-01-24T16:18:22.898Z",
            boundingBox: {
              x: 174,
              y: 179,
              width: 245,
              height: 202,
            },
            relativePoints: [
              {
                x: 0.478,
                y: 0.358,
              },
              {
                x: 0.838,
                y: 0.438,
              },
              {
                x: 0.72,
                y: 0.738,
              },
              {
                x: 0.472,
                y: 0.762,
              },
              {
                x: 0.348,
                y: 0.64,
              },
              {
                x: 0.386,
                y: 0.552,
              },
            ],
          },
        ],
      };
    } else {
      newAnnotations = {};
    }
    setAnnotationMethod(value);
    setAnnotations(newAnnotations);

    const currentImage = imageList[currentImageIndex];
    if (!currentImage) return;
    const imgAnnotations = newAnnotations[currentImage.id] || [];
    setCurrentAnnotations(imgAnnotations);
    // 重置图片偏移
    setImageOffset({ x: 0, y: 0 });
    // 切换图片时重置撤销和复原栈
    setUndoStack([]);
    setRedoStack([]);
  };

  // 设置虚拟列表的高度
  useEffect(() => {
    if (imageListRef.current) {
      setImageVirtualListHeight(imageListRef.current.clientHeight);
    }
  }, [imageListRef]);

  // 图片加载完成后设置Canvas尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    const img = imageRef.current;

    const handleImageLoad = () => {
      setLoadingData({
        spinning: false,
      });
      // 设置Canvas尺寸为容器尺寸
      const rect = container.getBoundingClientRect();
      const newSize = {
        width: Math.max(800, rect.width), // 减去padding
        height: Math.max(600, rect.height),
      };

      setCanvasSize(newSize);
      setImageWidth(img.width);
      setImageHeight(img.height);

      // 计算适合的初始缩放比例，确保图片能完整显示在Canvas中
      const containerWidth = newSize.width;
      const containerHeight = newSize.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      // 计算宽高缩放比例
      const scaleX = containerWidth / imgWidth;
      const scaleY = containerHeight / imgHeight;

      // 使用较小的缩放比例，确保图片完整显示
      const initialScale = Math.min(scaleX, scaleY) * 100;

      // 如果图片比容器小，则保持100%缩放
      setZoom(Math.min(initialScale, 100));

      // 设置Canvas高清显示
      setupHighDpiCanvas(canvas, newSize.width, newSize.height);

      drawAnnotations();
    };

    const handleImageError = () => {
      message.error("图片加载失败");
      setLoadingData({
        spinning: false,
      });
    };

    if (canvas && container && img) {
      setLoadingData({
        spinning: true,
        tip: "图片加载中...",
      });
      img.addEventListener("load", handleImageLoad);
      img.addEventListener("error", handleImageError);
    }
    return () => {
      img.removeEventListener("load", handleImageLoad);
      img.removeEventListener("error", handleImageError);
    };
  }, [imageUrl]);

  // 缩放变化时重新绘制
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 重新设置Canvas高清显示
      setupHighDpiCanvas(canvas, canvasSize.width, canvasSize.height);
      drawAnnotations();
    }
  }, [
    zoom,
    currentAnnotations,
    currentAnnotation,
    isDrawing,
    imageOffset,
    imageWidth,
    imageHeight,
  ]);

  return (
    <Spin {...loadingData}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.annotationType}>
              <Tooltip placement="bottom" title="矩形标注">
                <div
                  className={`iconfont icon-rectangle ${
                    annotationType === SHAPE_TYPE.RECTANGLE ? "active" : ""
                  }`}
                  onClick={() => setAnnotationType(SHAPE_TYPE.RECTANGLE)}
                />
              </Tooltip>
              <Tooltip placement="bottom" title="多边形标注">
                <div
                  className={`iconfont icon-polygon ${
                    annotationType === SHAPE_TYPE.POLYGON ? "active" : ""
                  }`}
                  onClick={() => setAnnotationType(SHAPE_TYPE.POLYGON)}
                />
              </Tooltip>
            </div>
            <div className={styles.line} />
            <div className={styles.redoAndUndo}>
              <Tooltip placement="bottom" title="撤销">
                <UndoOutlined className={styles.icon} onClick={handleUndo} />
              </Tooltip>
              <Tooltip placement="bottom" title="复原">
                <RedoOutlined className={styles.icon} onClick={handleRedo} />
              </Tooltip>
            </div>
          </div>
          <Tag.CheckableTagGroup
            className={styles.annotationMethod}
            options={[
              { label: "手动标注", value: 1 },
              { label: "YOLO自动检测", value: 2 },
            ]}
            value={annotationMethod}
            onChange={handleAnnotationMethodChange}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <div className={styles.progress}>进度：0 / 50</div>
            <div className={styles.imageList}>
              <div ref={imageListRef} className={styles.imageListInner}>
                <VirtualList
                  height={imageVirtualListHeight}
                  itemHeight={86}
                  itemKey="id"
                  data={imageList}
                >
                  {(item, index) => {
                    return (
                      <div
                        key={item.id}
                        className={styles.imageItem}
                        style={{
                          border:
                            index === currentImageIndex
                              ? "2px solid #1677ff"
                              : "2px solid transparent",
                        }}
                        onClick={() => handleImageChange(index)}
                      >
                        <img
                          className={styles.imageThumb}
                          src={item.thumbUrl}
                          alt={item.name}
                        />
                        <div
                          className={styles.imageStatus}
                          style={{
                            backgroundColor: annotations[item.id]
                              ? "#52c41a"
                              : "#ff4d4f",
                          }}
                        />
                      </div>
                    );
                  }}
                </VirtualList>
              </div>
            </div>
          </div>
          <div className={styles.main}>
            <div ref={canvasContainerRef} className={styles.canvasContainer}>
              {/* 隐藏的图片元素，用于获取图片尺寸 */}
              <img
                ref={imageRef}
                src={imageUrl}
                alt="标注图片"
                style={{ display: "none" }}
              />
              {/* 用于绘制的Canvas */}
              <canvas
                ref={canvasRef}
                style={{
                  cursor: "crosshair",
                  display: "block",
                }}
                onMouseDown={(e) => {
                  handleMouseDown(e);
                  handleMouseDownForDrag(e);
                }}
                onMouseMove={(e) => {
                  handleMouseMove(e);
                  handleMouseMoveForDrag(e);
                }}
                onMouseUp={(e) => {
                  handleMouseUp(e);
                  handleMouseUpForDrag(e);
                }}
                onMouseLeave={(e) => {
                  handleMouseUp(e);
                  handleMouseUpForDrag(e);
                }}
                onDoubleClick={handleDoubleClick}
                onWheel={(e) => {
                  e.preventDefault();
                  // 使用节流后的缩放函数
                  throttledZoom(e.deltaY);
                }}
              />
            </div>
          </div>
          <div className={styles.rightbar}>
            <div className={styles.paramItem}>
              <div className={styles.paramLabel}>病害类型</div>
              {diseaseTypes.map((item) => (
                <Tag
                  className={styles.diseaseType}
                  variant={diseaseType === item.value ? "solid" : "outlined"}
                  color={item.color}
                  onClick={() => setDiseaseType(item.value)}
                >
                  {item.label}
                </Tag>
              ))}
            </div>
            <div className={styles.paramItem}>
              <div className={styles.paramLabel}>标注备注</div>
              <Input.TextArea
                className={styles.textarea}
                placeholder="输入病害详细描述、位置信息等..."
                value={diseaseRemark}
                onChange={(e) => setDiseaseRemark(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className={`${styles.paramItem} ${styles.markList}`}>
              <div className={styles.paramLabel}>
                标注列表
                <Popconfirm
                  title="确认清空所有标注吗？"
                  onConfirm={handleClear}
                >
                  <a
                    style={{ color: "#ff4d4f" }}
                    className={styles.markListItemDeleteBtn}
                  >
                    清空
                  </a>
                </Popconfirm>
              </div>
              <div className={styles.markListWrapper}>
                {!!currentAnnotations?.length && (
                  <List
                    dataSource={currentAnnotations}
                    renderItem={(item, index) => {
                      const typeInfo =
                        diseaseTypes.find((t) => t.value === item.type) ||
                        diseaseTypes[diseaseTypes.length - 1];
                      return (
                        <List.Item
                          key={item.id}
                          actions={[
                            <Popconfirm
                              title="确认删除该标注吗？"
                              onConfirm={() => handleDeleteAnnotation(item.id)}
                            >
                              <a
                                style={{ color: "#ff4d4f" }}
                                className={styles.markListItemDeleteBtn}
                              >
                                删除
                              </a>
                            </Popconfirm>,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <Badge
                                color={typeInfo.color}
                                text={`标注 ${index + 1}`}
                                style={{ color: "#fff" }}
                              />
                            }
                            description={
                              <div className={styles.markListItemDesc}>
                                <div>病害类型: {typeInfo.label}</div>
                                <div>标注备注: {item.name}</div>
                                <div>置信度: 80%</div>
                                <div>
                                  创建时间:{" "}
                                  {new Date(item.createdAt).toLocaleString()}
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            color="primary"
            variant="solid"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{ marginLeft: 8 }}
          >
            保存标注
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default DiseaseMark;
