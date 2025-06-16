# Giải Thích Chi Tiết Tính Năng Vẽ (Drawing Feature)

Tài liệu này cung cấp một cái nhìn chi tiết từ A-Z về cách hoạt động của tính năng vẽ trong ứng dụng, bao gồm giải thích từng thành phần, hàm, và đoạn code liên quan. Mục tiêu là giúp bạn hiểu rõ cách các thành phần tương tác với nhau và cách sử dụng thư viện Fabric.js để xây dựng một ứng dụng vẽ tương tác.

## 1. Tổng Quan Về Tính Năng Vẽ

Tính năng vẽ được xây dựng dựa trên thư viện **Fabric.js**, một thư viện JavaScript mạnh mẽ để làm việc với canvas HTML5. Nó cho phép người dùng vẽ các hình cơ bản (đường thẳng, hình chữ nhật, hình tròn), sử dụng bút vẽ tự do, tẩy xóa, chọn màu và kích thước bút, cũng như hỗ trợ undo/redo và xóa toàn bộ canvas.

Các thành phần chính của tính năng này bao gồm:
- **DrawingCanvas**: Thành phần React hiển thị canvas và xử lý các sự kiện vẽ.
- **DrawingToolbar**: Thanh công cụ chứa các nút để chọn công cụ vẽ, màu sắc, kích thước bút, và các hành động như undo/redo.
- **DrawingStore**: Store Zustand để quản lý trạng thái của ứng dụng vẽ (canvas, công cụ hiện tại, lịch sử vẽ, v.v.).

## 2. Cấu Trúc File và Thư Mục

- **`drawing-canvas.tsx`**: Chứa logic chính để khởi tạo canvas, xử lý các sự kiện chuột và vẽ các hình dạng.
- **`drawing-toolbar.tsx`**: Giao diện người dùng cho các công cụ vẽ và hành động.
- **`drawing-store.ts`**: Quản lý trạng thái ứng dụng bằng Zustand.
- **`page.tsx`**: Trang chính của tính năng vẽ, nơi các thành phần được kết hợp lại.

## 3. Giải Thích Chi Tiết Các Thành Phần

### 3.1. DrawingCanvas (`drawing-canvas.tsx`)

#### Tổng Quan
`DrawingCanvas` là thành phần React chịu trách nhiệm khởi tạo và quản lý canvas Fabric.js. Nó xử lý các sự kiện chuột để vẽ, cập nhật cài đặt canvas khi công cụ thay đổi, và lưu trữ lịch sử vẽ.

#### Các Biến và Hook Quan Trọng
- **`canvasRef`**: Một `useRef` để tham chiếu đến phần tử `<canvas>` trong DOM.
- **`fabricCanvasRef`**: Một `useRef` để lưu trữ đối tượng `Canvas` của Fabric.js.
- **`useDrawingStore` và `useShallow`**: Hook Zustand để truy cập và cập nhật trạng thái từ store, sử dụng `useShallow` để tối ưu hóa hiệu suất bằng cách chỉ lấy các phần trạng thái cần thiết.

#### Khởi Tạo Canvas
```typescript
useEffect(() => {
  if (!canvasRef.current) return

  // Initialize Fabric.js canvas
  const fabricCanvas = new Canvas(canvasRef.current, {
    width,
    height,
    backgroundColor: '#ffffff',
    selection: false,
    skipOffscreen: false
  })

  fabricCanvasRef.current = fabricCanvas
  setCanvas(fabricCanvas)

  // Add initial state to history
  addToHistory(JSON.stringify(fabricCanvas.toJSON()))
  // ... các sự kiện khác
}, [width, height, setCanvas, addToHistory, setIsDrawing])
```
- **Giải thích**: Khởi tạo một đối tượng `Canvas` của Fabric.js với các thuộc tính như chiều rộng, chiều cao, màu nền trắng, và tắt chế độ chọn (`selection: false`). Trạng thái ban đầu của canvas được lưu vào lịch sử dưới dạng JSON.
- **Tài liệu tham khảo**: [Fabric.js Canvas Documentation](http://fabricjs.com/docs/fabric.Canvas.html)

#### Xử Lý Sự Kiện và Lưu Lịch Sử
```typescript
fabricCanvas.on('path:created', () => {
  setTimeout(() => {
    addToHistory(JSON.stringify(fabricCanvas.toJSON()))
  }, 10)
})

fabricCanvas.on('mouse:down', () => setIsDrawing(true))
fabricCanvas.on('mouse:up', () => setIsDrawing(false))
```
- **Giải thích**: 
  - Sự kiện `path:created` được kích hoạt khi một đường vẽ tự do (brush) được hoàn thành, và trạng thái canvas được lưu vào lịch sử sau một khoảng thời gian ngắn (`setTimeout`) để đảm bảo canvas đã được render xong.
  - Sự kiện `mouse:down` và `mouse:up` cập nhật trạng thái `isDrawing` để theo dõi xem người dùng có đang vẽ hay không.
- **Tài liệu tham khảo**: [Fabric.js Events](http://fabricjs.com/events)

#### Cập Nhật Cài Đặt Canvas Theo Công Cụ
```typescript
useEffect(() => {
  if (!canvas) return

  // Disable selection for all objects
  canvas.forEachObject((obj) => {
    obj.selectable = false
    obj.evented = false
  })

  switch (currentTool.type) {
    case 'brush':
      canvas.isDrawingMode = true
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas)
      }
      canvas.freeDrawingBrush.color = currentTool.color
      canvas.freeDrawingBrush.width = currentTool.width
      canvas.selection = false
      break
    // ... các case khác
  }

  canvas.renderAll()
}, [canvas, currentTool.type, currentTool.color, currentTool.width])
```
- **Giải thích**: 
  - Vô hiệu hóa khả năng chọn và tương tác (`selectable` và `evented`) cho tất cả đối tượng trên canvas để ngăn người dùng di chuyển chúng.
  - Cập nhật chế độ vẽ (`isDrawingMode`) và các thuộc tính của bút vẽ (`color`, `width`) dựa trên công cụ hiện tại.
  - Gọi `renderAll()` để làm mới canvas sau khi thay đổi.
- **Tài liệu tham khảo**: [Fabric.js Drawing Mode](http://fabricjs.com/freedrawing)

#### Xử Lý Vẽ Hình Dạng
```typescript
useEffect(() => {
  if (!canvas || currentTool.type === 'brush' || currentTool.type === 'eraser') return

  let isDown = false
  let origX = 0
  let origY = 0
  let shape: FabricObject | null = null

  const handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
    isDown = true
    const pointer = canvas.getScenePoint(options.e)
    origX = pointer.x
    origY = pointer.y
    // ... khởi tạo shape dựa trên currentTool.type
  }

  const handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
    if (!isDown || !shape) return
    // ... cập nhật kích thước và vị trí của shape
  }

  const handleMouseUp = () => {
    if (isDown && shape) {
      // Add to history only when shape drawing is complete
      setTimeout(() => {
        addToHistory(JSON.stringify(canvas.toJSON()))
      }, 10)
    }
    isDown = false
    shape = null
  }
  // ... đăng ký và hủy sự kiện
}, [canvas, currentTool, addToHistory])
```
- **Giải thích**: 
  - Xử lý các sự kiện chuột để vẽ các hình dạng như đường thẳng, hình chữ nhật, và hình tròn.
  - Lưu trạng thái vào lịch sử chỉ khi hoàn thành vẽ hình (trong `handleMouseUp`).
  - Các thuộc tính như `selectable: false`, `evented: false` được đặt để ngăn tương tác với hình sau khi vẽ.
- **Tài liệu tham khảo**: [Fabric.js Shapes](http://fabricjs.com/docs/fabric.Rect.html), [Fabric.js Mouse Events](http://fabricjs.com/events)

### 3.2. DrawingToolbar (`drawing-toolbar.tsx`)

#### Tổng Quan
`DrawingToolbar` là giao diện người dùng cho phép chọn công cụ vẽ, màu sắc, kích thước bút, và thực hiện các hành động như undo, redo, và xóa canvas.

#### Các Thành Phần Chính
- **TOOLS**: Một mảng chứa thông tin về các công cụ vẽ (brush, eraser, line, rectangle, circle).
- **COLORS**: Một mảng các màu sắc có sẵn để người dùng chọn.
- **Slider**: Thành phần để điều chỉnh kích thước bút.
- **Button**: Các nút cho undo, redo, và xóa canvas.

#### Chọn Công Cụ và Cập Nhật Trạng Thái
```typescript
<Button
  key={tool.type}
  variant={currentTool.type === tool.type ? 'default' : 'ghost'}
  size="sm"
  onClick={() => setTool({ type: tool.type })}
  title={tool.label}
>
  <Icon className="h-4 w-4" />
</Button>
```
- **Giải thích**: Khi người dùng nhấp vào một công cụ, hàm `setTool` được gọi để cập nhật loại công cụ hiện tại trong store.
- **Tài liệu tham khảo**: [Shadcn/ui Button](https://ui.shadcn.com/docs/components/button)

#### Chọn Màu Sắc
```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="sm" className="gap-2">
      <div 
        className="w-4 h-4 rounded border border-border"
        style={{ backgroundColor: currentTool.color }}
      />
      <Palette className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-2">
    <div className="grid grid-cols-5 gap-1">
      {COLORS.map((color) => (
        <button
          key={color}
          className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
          onClick={() => setTool({ color })}
          title={color}
        />
      ))}
    </div>
  </PopoverContent>
</Popover>
```
- **Giải thích**: Sử dụng `Popover` từ shadcn/ui để hiển thị bảng chọn màu. Khi người dùng chọn một màu, hàm `setTool` được gọi để cập nhật màu sắc trong store.
- **Tài liệu tham khảo**: [Shadcn/ui Popover](https://ui.shadcn.com/docs/components/popover)

### 3.3. DrawingStore (`drawing-store.ts`)

#### Tổng Quan
`DrawingStore` sử dụng Zustand để quản lý trạng thái của ứng dụng vẽ, bao gồm canvas, công cụ hiện tại, trạng thái vẽ, và lịch sử.

#### Trạng Thái và Hàm
- **`canvas`**: Lưu trữ đối tượng `Canvas` của Fabric.js.
- **`currentTool`**: Công cụ hiện tại với các thuộc tính như loại, màu sắc, và độ rộng.
- **`history` và `historyIndex`**: Lưu trữ lịch sử trạng thái canvas dưới dạng JSON và chỉ số hiện tại trong lịch sử.
- **`setCanvas`, `setTool`, `setIsDrawing`**: Các hàm cập nhật trạng thái cơ bản.
- **`addToHistory`**:
  ```typescript
  addToHistory: (canvasData) => set((state) => {
    // Prevent duplicate consecutive states
    if (state.history.length > 0 && state.history[state.historyIndex] === canvasData) {
      return state
    }
    
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(canvasData)
    
    // Limit history size to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift()
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1
      }
    }
    // ... trả về trạng thái mới
  })
  ```
  - **Giải thích**: Thêm trạng thái mới vào lịch sử, tránh trùng lặp và giới hạn kích thước lịch sử để tiết kiệm bộ nhớ.
- **`undo` và `redo`**:
  ```typescript
  undo: () => {
    const { canvas, history, historyIndex } = get()
    if (canvas && historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      canvas.loadFromJSON(prevState).then(() => {
        // Ensure all objects are non-selectable after loading
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
  - **Giải thích**: Tải trạng thái trước đó hoặc tiếp theo từ lịch sử, đảm bảo các đối tượng không thể chọn được sau khi tải, và làm mới canvas.
- **Tài liệu tham khảo**: [Zustand Documentation](https://zustand-demo.pmnd.rs/), [Fabric.js JSON Serialization](http://fabricjs.com/docs/fabric.Canvas.html#toJSON)

## 4. Cách Các Thành Phần Tương Tác

1. **Người dùng chọn công cụ/màu/kích thước từ Toolbar** → Trạng thái trong Store được cập nhật qua `setTool`.
2. **Store cập nhật trạng thái** → `DrawingCanvas` nhận thay đổi qua `useDrawingStore` và cập nhật cài đặt canvas (ví dụ: chế độ vẽ, màu bút).
3. **Người dùng vẽ trên Canvas** → Các sự kiện chuột được xử lý, đối tượng được thêm vào canvas, và lịch sử được lưu vào Store qua `addToHistory`.
4. **Người dùng thực hiện Undo/Redo** → Store tải trạng thái từ lịch sử và áp dụng lên canvas.

## 5. Tài Liệu Tham Khảo Trên Mạng

- **Fabric.js Official Documentation**: [http://fabricjs.com/docs/](http://fabricjs.com/docs/) - Tài liệu chính thức về Fabric.js, bao gồm tất cả các lớp, phương thức và sự kiện.
- **Fabric.js Tutorials**: [http://fabricjs.com/articles/](http://fabricjs.com/articles/) - Các bài hướng dẫn chi tiết về cách sử dụng Fabric.js.
- **Zustand GitHub & Documentation**: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) - Tài liệu và ví dụ về Zustand để quản lý trạng thái.
- **React Documentation**: [https://react.dev/](https://react.dev/) - Tài liệu chính thức của React, hữu ích để hiểu về hooks và component lifecycle.
- **Shadcn/ui Components**: [https://ui.shadcn.com/](https://ui.shadcn.com/) - Tài liệu về các thành phần giao diện như Button, Slider, Popover được sử dụng trong toolbar.

## 6. Kết Luận

Tính năng vẽ được xây dựng dựa trên sự kết hợp giữa Fabric.js để xử lý canvas, React để quản lý giao diện, và Zustand để quản lý trạng thái. Mỗi thành phần có vai trò riêng và tương tác chặt chẽ với nhau để tạo ra trải nghiệm vẽ mượt mà. Nếu bạn có thêm câu hỏi hoặc cần giải thích sâu hơn về bất kỳ phần nào, hãy cho tôi biết! 