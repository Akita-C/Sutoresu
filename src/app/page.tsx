export default function TestHeaderPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Test Header Page</h1>
      <p className="text-muted-foreground">
        Đây là trang test để xem header hoạt động như thế nào. Hãy hover vào
        menu &quot;Products&quot; để xem dropdown menu.
      </p>

      <div className="mt-8 space-y-4">
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">
            Content area for testing scroll behavior
          </p>
        </div>
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">More content...</p>
        </div>
      </div>
    </div>
  );
}
