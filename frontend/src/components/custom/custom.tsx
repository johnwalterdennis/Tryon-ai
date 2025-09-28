export default function Custom() {
    return(
        <div
            className="border-2 border-dashed border-darkpink/30 rounded-lg h-96 text-center bg-darkpink/10 cursor-pointer  mx-auto my-10 w-full"
        >
            <label className="cursor-pointer h-full w-full flex items-center justify-center">
                <div className="text-medium text-darkpink font-medium mb-4">
                    <code>Drag & drop images here, or click to upload</code>
                </div>
            </label>
        </div>
    )
}