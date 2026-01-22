import { useState, useRef, useEffect, useMemo } from "react";
import { Input, message, List, Tag, Badge, Button, Tooltip, Modal } from "antd";
import {
  SaveOutlined,
  ClearOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useThrottleFn } from "ahooks";
import styles from "./index.module.less";
import img from "./a.jpg";
import img2 from "./c.jpg";

const DiseaseMark = () => {
  // 状态管理
  const [imageList, setImageList] = useState([
    { id: 1, url: img, name: "图片1" },
    { id: 2, url: img2, name: "图片2" },
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(img);
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
  const completeAnnotationCount = useMemo(
    () => Object.keys(annotations || {}).length,
    [annotations],
  );

  // 引用
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const canvasContainerRef = useRef(null);

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

  // Canvas尺寸状态
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  });
  const devicePixelRatio = window.devicePixelRatio || 1;

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
    // 初始缩放将由imageUrl变化的useEffect处理
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

    // 重新绘制
    drawAnnotations();
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

  // 监听当前图片索引变化
  useEffect(() => {
    if (imageList.length > 0) {
      const currentImage = imageList[currentImageIndex];
      setImageUrl(currentImage.url);
      // 加载对应图片的标注
      const imgAnnotations = annotations[currentImage.id] || [];
      setCurrentAnnotations(imgAnnotations);
    }
  }, [currentImageIndex, imageList, annotations]);

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

      if (annotationType === "rectangle") {
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

      if (annotation.shape === "polygon") {
        // 绘制多边形
        if (annotation.points && annotation.points.length > 2) {
          ctx.beginPath();
          // 应用缩放和偏移绘制多边形
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

          // 绘制多边形顶点
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
      } else {
        // 绘制矩形（应用缩放和偏移）
        const rectX = imageX + annotation.x * scaleFactor;
        const rectY = imageY + annotation.y * scaleFactor;
        const rectWidth = annotation.width * scaleFactor;
        const rectHeight = annotation.height * scaleFactor;

        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
      }

      // 绘制标注信息背景
      const labelX =
        annotation.shape === "polygon" && annotation.points.length > 0
          ? imageX + annotation.points[0].x * scaleFactor
          : imageX + annotation.x * scaleFactor;
      const labelY =
        annotation.shape === "polygon" && annotation.points.length > 0
          ? imageY + annotation.points[0].y * scaleFactor
          : imageY + annotation.y * scaleFactor;

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

    if (annotationType === "rectangle") {
      // 矩形模式 - 开始绘制
      setCurrentAnnotation({ x, y, width: 0, height: 0 });
      setIsDrawing(true);
    } else if (annotationType === "polygon") {
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

    if (annotationType === "rectangle") {
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
    if (!isDrawing || annotationType !== "rectangle") return;

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
        const newAnnotation = {
          id: Date.now(),
          shape: "rectangle",
          x: relativeX,
          y: relativeY,
          width: relativeWidth,
          height: relativeHeight,
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
    if (!isDrawing || annotationType !== "polygon") return;

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
      shape: "polygon",
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
      if (e.key === "Enter" && isDrawing && annotationType === "polygon") {
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

    // 保存当前图片的标注到annotations对象中
    setAnnotations((prev) => ({
      ...prev,
      [currentImage.id]: currentAnnotations,
    }));

    // 构建标注数据
    const annotationData = {
      imageUrl,
      imageId: currentImage.id,
      imageName: currentImage.name,
      annotations: currentAnnotations.map((anno) => {
        if (anno.shape === "polygon") {
          // 多边形标注 - 计算相对坐标
          return {
            ...anno,
            // 计算多边形的边界框
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
            // 计算相对坐标
            relativePoints: anno.points.map((p) => ({
              x: p.x / imageWidth || 0,
              y: p.y / imageHeight || 0,
            })),
          };
        } else {
          // 矩形标注 - 计算相对坐标
          return {
            ...anno,
            relativeX: anno.x / imageWidth || 0,
            relativeY: anno.y / imageHeight || 0,
            relativeWidth: anno.width / imageWidth || 0,
            relativeHeight: anno.height / imageHeight || 0,
          };
        }
      }),
      timestamp: new Date().toISOString(),
      totalAnnotations: currentAnnotations.length,
      rectangleCount: currentAnnotations.filter((a) => a.shape === "rectangle")
        .length,
      polygonCount: currentAnnotations.filter((a) => a.shape === "polygon")
        .length,
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

    Modal.confirm({
      title: "确认清除所有标注吗？",
      okText: "确认",
      okType: "danger",
      onOk: () => {
        // 清除前保存当前状态到撤销栈
        setUndoStack((prev) => [...prev, currentAnnotations]);
        // 清空复原栈，因为有了新操作
        setRedoStack([]);

        const currentImage = imageList[currentImageIndex];
        setCurrentAnnotations([]);
        // 更新annotations对象
        setAnnotations((prev) => ({
          ...prev,
          [currentImage.id]: [],
        }));
        setCurrentAnnotation({ x: 0, y: 0, width: 0, height: 0 });
        setPolygonPoints([]);
        setIsDrawing(false);
        message.success("所有标注已清除");
      },
    });
  };

  // 删除单个标注
  const handleDeleteAnnotation = (id) => {
    Modal.confirm({
      title: "确认删除该标注吗？",
      okText: "确认",
      okType: "danger",
      onOk: () => {
        // 删除前保存当前状态到撤销栈
        setUndoStack((prev) => [...prev, currentAnnotations]);
        // 清空复原栈，因为有了新操作
        setRedoStack([]);

        const updatedAnnotations = currentAnnotations.filter(
          (anno) => anno.id !== id,
        );
        setCurrentAnnotations(updatedAnnotations);

        // 更新annotations对象
        const currentImage = imageList[currentImageIndex];
        setAnnotations((prev) => ({
          ...prev,
          [currentImage.id]: updatedAnnotations,
        }));
        message.success("标注已删除");
      },
    });
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

    // 更新annotations对象
    const currentImage = imageList[currentImageIndex];

    setAnnotations((prev) => ({
      ...prev,
      [currentImage.id]: previousAnnotations,
    }));

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

    // 更新annotations对象
    const currentImage = imageList[currentImageIndex];
    setAnnotations((prev) => ({
      ...prev,
      [currentImage.id]: nextAnnotations,
    }));

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

  // 图片加载完成后设置Canvas尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    const img = imageRef.current;

    if (canvas && container && img) {
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
    }
  }, [imageUrl]);

  // 窗口大小变化时更新Canvas尺寸
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvasContainerRef.current;
      if (canvas && container) {
        const rect = container.getBoundingClientRect();
        const newSize = {
          width: Math.max(800, rect.width),
          height: Math.max(600, rect.height),
        };

        setCanvasSize(newSize);
        setupHighDpiCanvas(canvas, newSize.width, newSize.height);

        drawAnnotations();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawAnnotations]);

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
    imageWidth,
    imageHeight,
    currentAnnotations,
    currentAnnotation,
    isDrawing,
    imageOffset,
  ]);

  // 标注变化时重新绘制
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 确保Canvas高清显示
      setupHighDpiCanvas(canvas, canvasSize.width, canvasSize.height);
      drawAnnotations();
    }
  }, [currentAnnotation, isDrawing, currentAnnotations, imageUrl, imageOffset]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.annotationType}>
          <Tooltip placement="bottom" title="矩形标注">
            <div
              className={`iconfont icon-rectangle ${
                annotationType === "rectangle" ? "active" : ""
              }`}
              onClick={() => setAnnotationType("rectangle")}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="多边形标注">
            <div
              className={`iconfont icon-polygon ${
                annotationType === "polygon" ? "active" : ""
              }`}
              onClick={() => setAnnotationType("polygon")}
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
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.progress}>
            进度：{completeAnnotationCount} / {imageList.length}
          </div>
          <div className={styles.imageList}>
            {imageList.map((item, index) => (
              <div
                key={item.id}
                className={styles.imageItem}
                style={{
                  border:
                    index === currentImageIndex
                      ? "2px solid #3d75c3"
                      : "2px solid transparent",
                }}
                onClick={() => handleImageChange(index)}
              >
                <img
                  className={styles.imageThumb}
                  src={item.url}
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
            ))}
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
                transition: "width 0.2s ease, height 0.2s ease",
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
              placeholder="输入标注备注"
              value={diseaseRemark}
              onChange={(e) => setDiseaseRemark(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className={`${styles.paramItem} ${styles.markList}`}>
            <div className={styles.paramLabel}>标注列表</div>
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
                          <a
                            style={{ color: "#ff4d4f" }}
                            className={styles.markListItemDeleteBtn}
                            onClick={() => handleDeleteAnnotation(item.id)}
                          >
                            删除
                          </a>,
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
        <Button
          color="danger"
          variant="solid"
          icon={<ClearOutlined />}
          onClick={handleClear}
          style={{ marginLeft: 8 }}
        >
          清除所有
        </Button>
      </div>
    </div>
  );
};

export default DiseaseMark;
