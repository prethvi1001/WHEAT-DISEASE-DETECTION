$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "CropShield Web App Server running live at http://localhost:8080/"

$folder = Join-Path $PSScriptRoot "cropshield-backend\src\main\resources\static"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }
        
        $filePath = Join-Path $folder $path.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            if ($filePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath.EndsWith(".js")) { $response.ContentType = "application/javascript; charset=utf-8" }
            elseif ($filePath.EndsWith(".css")) { $response.ContentType = "text/css; charset=utf-8" }
            elseif ($filePath.EndsWith(".png")) { $response.ContentType = "image/png" }
            elseif ($filePath.EndsWith(".jpg") -or $filePath.EndsWith(".jpeg")) { $response.ContentType = "image/jpeg" }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        # continue listener loop on error
    }
}
