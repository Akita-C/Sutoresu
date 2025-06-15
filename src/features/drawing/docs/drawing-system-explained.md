# Drawing System - Hướng Dẫn Chi Tiết

## 📋 Mục Lục
1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Fabric.js - Thư Viện Core](#fabricjs---thư-viện-core)
3. [Zustand Store - Quản Lý State](#zustand-store---quản-lý-state)
4. [Drawing Canvas Component](#drawing-canvas-component)
5. [Drawing Toolbar Component](#drawing-toolbar-component)
6. [History System (Undo/Redo)](#history-system-undoredo)
7. [Selection Management](#selection-management)
8. [Event Handling](#event-handling)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)
11. [Tài Liệu Tham Khảo](#tài-liệu-tham-khảo)

---

## 🎯 Tổng Quan Hệ Thống

Drawing system của chúng ta được xây dựng dựa trên **Fabric.js** - một thư viện canvas mạnh mẽ cho JavaScript. Hệ thống bao gồm:

- **Canvas Component**: Xử lý việc vẽ và tương tác
- **Toolbar Component**: Cung cấp UI để chọn công cụ
- **Zustand Store**: Quản lý state toàn cục
- **History System**: Undo/Redo functionality

### Kiến Trúc Tổng Thể

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DrawingPage   │    │ DrawingToolbar  │    │ DrawingCanvas   │
│   (Server)      │───▶│   (Client)      │───▶│   (Client)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ DrawingStore    │    │   Fabric.js     │
                       │   (Zustand)     │    │    Canvas       │
                       └─────────────────┘    └─────────────────┘
```

---

## 🎨 Fabric.js - Thư Viện Core

### Fabric.js là gì?

Fabric.js là một thư viện JavaScript mạnh mẽ để làm việc với HTML5 Canvas. Nó cung cấp:

- **Object Model**: Quản lý objects trên canvas như layers
- **Interactivity**: Xử lý mouse/touch events
- **Serialization**: Convert canvas thành JSON và ngược lại
- **Animation**: Hỗ trợ animations và transitions

### Khởi Tạo Canvas

```typescript
const fabricCanvas = new Canvas(canvasRef.current, {
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  selection: false,        // Tắt selection box
  skipOffscreen: false    // Render objects ngoài viewport
})
```

**Giải thích các options:**
- `selection: false`: Ngăn người dùng select multiple objects
- `skipOffscreen: false`: Đảm bảo tất cả objects được render

### Drawing Modes

Fabric.js có hai mode chính:

1. **Drawing Mode** (`isDrawingMode: true`):
   - Dùng cho brush và eraser
   - Tạo ra `Path` objects
   - Sử dụng `freeDrawingBrush`

2. **Object Mode** (`isDrawingMode: false`):
   - Dùng cho shapes (rectangle, circle, line)
   - Tạo ra geometric objects
   - Xử lý mouse events manually

---

## 🗄️ Zustand Store - Quản Lý State

### Tại Sao Chọn Zustand?

Zustand là một state management library nhẹ và đơn giản:

```typescript
interface DrawingState {
  canvas: Canvas | null           // Fabric.js canvas instance
  currentTool: DrawingTool        // Tool hiện tại
  isDrawing: boolean             // Trạng thái đang vẽ
  history: string[]              // Canvas states cho undo/redo
  historyIndex: number           // Vị trí hiện tại trong history
}
```

### Tool Configuration

```typescript
interface DrawingTool {
  type: 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle'
  color: string    // Màu sắc (hex format)
  width: number    // Độ dày stroke
}
```

### State Actions

```typescript
// Cập nhật tool (partial update)
setTool: (tool: Partial<DrawingTool>) => void

// Quản lý canvas instance
setCanvas: (canvas: Canvas) => void

// History management
addToHistory: (canvasData: string) => void
undo: () => void
redo: () => void
```

---

## 🖼️ Drawing Canvas Component

### Component Structure

```typescript
export function DrawingCanvas({ width, height, className }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)
  
  // Zustand state
  const { canvas, currentTool, setCanvas, addToHistory } = useDrawingStore()
  
  // Effects
  useEffect(() => { /* Canvas initialization */ })
  useEffect(() => { /* Tool configuration */ })
  useEffect(() => { /* Shape drawing handlers */ })
}
```

### Canvas Initialization Effect

```typescript
useEffect(() => {
  if (!canvasRef.current) return

  // Tạo Fabric.js canvas
  const fabricCanvas = new Canvas(canvasRef.current, {
    width, height,
    backgroundColor: '#ffffff',
    selection: false
  })

  // Lưu vào store và ref
  setCanvas(fabricCanvas)
  fabricCanvasRef.current = fabricCanvas

  // Add initial state to history
  addToHistory(JSON.stringify(fabricCanvas.toJSON()))

  // Cleanup
  return () => fabricCanvas.dispose()
}, [width, height, setCanvas, addToHistory])
```

**Lý do cần cả ref và store:**
- **Ref**: Truy cập trực tiếp trong effects, không trigger re-render
- **Store**: Chia sẻ canvas instance với other components

### Tool Configuration Effect

```typescript
useEffect(() => {
  if (!canvas) return

  // Disable selection for ALL objects
  canvas.forEachObject((obj) => {
    obj.selectable = false
    obj.evented = false
  })

  switch (currentTool.type) {
    case 'brush':
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush.color = currentTool.color
      canvas.freeDrawingBrush.width = currentTool.width
      break
    
    case 'eraser':
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush.color = '#ffffff'  // Background color
      break
    
    default:  // Shapes
      canvas.isDrawingMode = false
      canvas.selection = false
  }
}, [canvas, currentTool])
```

### Shape Drawing Effect

Xử lý vẽ shapes (rectangle, circle, line):

```typescript
useEffect(() => {
  if (!canvas || currentTool.type === 'brush' || currentTool.type === 'eraser') return

  let isDown = false
  let origX = 0, origY = 0
  let shape: FabricObject | null = null

  const handleMouseDown = (options) => {
    const pointer = canvas.getScenePoint(options.e)
    
    // Tạo shape tương ứng
    switch (currentTool.type) {
      case 'rectangle':
        shape = new Rect({
          left: pointer.x, top: pointer.y,
          width: 0, height: 0,
          fill: 'transparent',
          stroke: currentTool.color,
          strokeWidth: currentTool.width,
          selectable: false,
          evented: false
        })
        break
    }
    
    canvas.add(shape)
  }

  // Register events
  canvas.on('mouse:down', handleMouseDown)
  
  return () => {
    canvas.off('mouse:down', handleMouseDown)
  }
}, [canvas, currentTool])
```

---

## 🛠️ Drawing Toolbar Component

### Tool Configuration

```typescript
const TOOLS = [
  { type: 'brush', icon: Brush, label: 'Brush' },
  { type: 'eraser', icon: Eraser, label: 'Eraser' },
  { type: 'line', icon: Minus, label: 'Line' },
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' }
]

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  // ... more colors
]
```

### Color Picker Implementation

```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="sm">
      <div 
        className="w-4 h-4 rounded border"
        style={{ backgroundColor: currentTool.color }}
      />
      <Palette className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="grid grid-cols-5 gap-1">
      {COLORS.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => setTool({ color })}
        />
      ))}
    </div>
  </PopoverContent>
</Popover>
```

### Size Slider

```typescript
<Slider
  value={[currentTool.width]}
  onValueChange={([width]) => setTool({ width })}
  min={1}
  max={50}
  step={1}
/>
```

---

## ⏱️ History System (Undo/Redo)

### Canvas Serialization

Fabric.js cung cấp `toJSON()` và `loadFromJSON()` để serialize/deserialize canvas:

```typescript
// Serialize canvas state
const canvasState = JSON.stringify(canvas.toJSON())

// Restore canvas state
canvas.loadFromJSON(canvasState).then(() => {
  canvas.renderAll()
})
```

### History Management

```typescript
addToHistory: (canvasData) => set((state) => {
  // Prevent duplicate consecutive states
  if (state.history[state.historyIndex] === canvasData) {
    return state
  }
  
  // Truncate future history when adding new state
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(canvasData)
  
  // Limit history size (memory management)
  if (newHistory.length > 50) {
    newHistory.shift()
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }
  
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1
  }
})
```

### Undo Implementation

```typescript
undo: () => {
  const { canvas, history, historyIndex } = get()
  if (canvas && historyIndex > 0) {
    const prevState = history[historyIndex - 1]
    
    canvas.loadFromJSON(prevState).then(() => {
      // Ensure objects remain non-selectable
      canvas.forEachObject((obj) => {
        obj.selectable = false
        obj.evented = false
      })
      canvas.selection = false
      canvas.renderAll()
      set({ historyIndex: historyIndex - 1 })
    })
  }
}
```

### When to Save History

1. **Brush/Eraser**: Sau khi hoàn thành path (`path:created` event)
2. **Shapes**: Sau khi hoàn thành vẽ shape (`mouse:up` event)
3. **Clear Canvas**: Ngay sau khi clear

```typescript
// For brush strokes
canvas.on('path:created', () => {
  setTimeout(() => {
    addToHistory(JSON.stringify(canvas.toJSON()))
  }, 10)
})

// For shapes
const handleMouseUp = () => {
  if (isDown && shape) {
    setTimeout(() => {
      addToHistory(JSON.stringify(canvas.toJSON()))
    }, 10)
  }
}
```

**Tại sao dùng setTimeout?**
- Đảm bảo canvas đã render xong trước khi serialize
- Tránh race conditions

---

## 🚫 Selection Management

### Vấn Đề Selection

Fabric.js mặc định cho phép select và move objects. Điều này không mong muốn trong drawing app.

### Giải Pháp Multi-Layer

1. **Canvas Level**:
```typescript
canvas.selection = false  // Tắt multi-selection
```

2. **Object Level**:
```typescript
object.selectable = false  // Không thể select
object.evented = false     // Không nhận events
```

3. **Cursor Management**:
```typescript
object.hoverCursor = 'default'  // Không đổi cursor khi hover
object.moveCursor = 'default'   // Không đổi cursor khi drag
```

### Enforce Non-Selection

```typescript
// Khi tool thay đổi
canvas.forEachObject((obj) => {
  obj.selectable = false
  obj.evented = false
})

// Khi load từ history
canvas.loadFromJSON(state).then(() => {
  canvas.forEachObject((obj) => {
    obj.selectable = false
    obj.evented = false
  })
})
```

---

## 🎭 Event Handling

### Fabric.js Events

```typescript
// Canvas events
canvas.on('mouse:down', handler)
canvas.on('mouse:move', handler)
canvas.on('mouse:up', handler)
canvas.on('path:created', handler)
canvas.on('object:added', handler)

// Cleanup
canvas.off('mouse:down', handler)
```

### Shape Drawing Flow

1. **Mouse Down**: Tạo shape với size 0
2. **Mouse Move**: Update size/position based on pointer
3. **Mouse Up**: Finalize shape và add to history

```typescript
const handleMouseDown = (options) => {
  isDown = true
  const pointer = canvas.getScenePoint(options.e)
  origX = pointer.x
  origY = pointer.y
  
  // Create initial shape
  shape = new Rect({ left: origX, top: origY, width: 0, height: 0 })
  canvas.add(shape)
}

const handleMouseMove = (options) => {
  if (!isDown || !shape) return
  
  const pointer = canvas.getScenePoint(options.e)
  
  // Update shape dimensions
  shape.set({
    width: Math.abs(pointer.x - origX),
    height: Math.abs(pointer.y - origY)
  })
  
  canvas.renderAll()
}
```

### Event Cleanup

Quan trọng phải cleanup events để tránh memory leaks:

```typescript
useEffect(() => {
  // Register events
  canvas.on('mouse:down', handleMouseDown)
  
  return () => {
    // Cleanup
    canvas.off('mouse:down', handleMouseDown)
  }
}, [canvas, currentTool])
```

---

## ⚡ Performance Optimization

### 1. Lazy History Updates

```typescript
// Sử dụng setTimeout để debounce
setTimeout(() => {
  addToHistory(JSON.stringify(canvas.toJSON()))
}, 10)
```

### 2. History Size Limiting

```typescript
// Giới hạn 50 states để tránh memory issues
if (newHistory.length > 50) {
  newHistory.shift()
}
```

### 3. Selective Object Updates

```typescript
// Chỉ update objects khi cần thiết
canvas.forEachObject((obj) => {
  if (obj.selectable !== false) {
    obj.selectable = false
    obj.evented = false
  }
})
```

### 4. useShallow for Zustand

```typescript
const { canvas, currentTool } = useDrawingStore(useShallow((state) => ({
  canvas: state.canvas,
  currentTool: state.currentTool
})))
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Undo/Redo không hoạt động**:
   - Check history có được save đúng không
   - Đảm bảo `loadFromJSON` dùng Promise syntax
   - Verify objects được restore với đúng properties

2. **Objects vẫn selectable**:
   - Set properties ở multiple levels (canvas + object)
   - Enforce sau mỗi history load
   - Check cursor settings

3. **Performance issues**:
   - Limit history size
   - Use setTimeout for async operations
   - Minimize re-renders with useShallow

### Debug Tools

```typescript
// Log canvas state
console.log('Canvas JSON:', canvas.toJSON())

// Log history
console.log('History:', history)

// Check object properties
canvas.forEachObject((obj) => {
  console.log('Object selectable:', obj.selectable)
})
```

---

## 📚 Tài Liệu Tham Khảo

### Official Documentation

1. **Fabric.js**:
   - [Official Documentation](http://fabricjs.com/docs/)
   - [Fabric.js GitHub](https://github.com/fabricjs/fabric.js)
   - [Fabric.js Tutorials](http://fabricjs.com/articles/)

2. **Zustand**:
   - [Zustand Documentation](https://zustand-demo.pmnd.rs/)
   - [Zustand GitHub](https://github.com/pmndrs/zustand)

3. **React 19 Features**:
   - [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
   - [useOptimistic Hook](https://react.dev/reference/react/useOptimistic)
   - [useTransition Hook](https://react.dev/reference/react/useTransition)

### Advanced Topics

1. **Canvas Performance**:
   - [HTML5 Canvas Performance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
   - [Fabric.js Performance Tips](http://fabricjs.com/fabric-intro-part-4)

2. **Event Handling**:
   - [Fabric.js Events Guide](http://fabricjs.com/events)
   - [Mouse Event Handling](http://fabricjs.com/fabric-intro-part-2)

3. **State Management Patterns**:
   - [Zustand Best Practices](https://github.com/pmndrs/zustand/wiki/Best-Practices)
   - [React State Management](https://react.dev/learn/managing-state)

### Video Tutorials

1. **Fabric.js Basics**:
   - [Fabric.js Crash Course - YouTube](https://www.youtube.com/results?search_query=fabric.js+tutorial)
   - [Building Drawing Apps with Fabric.js](https://www.youtube.com/results?search_query=fabric.js+drawing+app)

2. **React Patterns**:
   - [Advanced React Patterns](https://www.youtube.com/results?search_query=advanced+react+patterns)
   - [Zustand Tutorial](https://www.youtube.com/results?search_query=zustand+tutorial)

### Code Examples

1. **Fabric.js Examples**:
   - [Fabric.js Demos](http://fabricjs.com/demos/)
   - [CodePen Fabric.js Examples](https://codepen.io/search/pens?q=fabric.js)

2. **React Canvas Examples**:
   - [React Canvas Libraries Comparison](https://github.com/topics/react-canvas)
   - [Drawing App Examples](https://github.com/search?q=react+drawing+app)

---

## 🎯 Kết Luận

Drawing system này sử dụng:

- **Fabric.js** cho canvas manipulation
- **Zustand** cho state management  
- **React patterns** cho component organization
- **History pattern** cho undo/redo functionality

Key principles:

1. **Separation of Concerns**: Canvas logic tách biệt với UI logic
2. **Performance First**: Optimize cho user experience
3. **Type Safety**: TypeScript cho better developer experience
4. **Clean Architecture**: Maintainable và scalable code

Hệ thống này có thể mở rộng thêm nhiều features như:
- Layers management
- Export/Import functionality  
- Collaborative drawing
- Advanced brush types
- Shape transformations

---

*Last updated: $(date +'%Y-%m-%d')*
*Author: AI Assistant* 