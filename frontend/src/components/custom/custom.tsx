export default function Custom() {
    return(
        <div
            className="border-2 border-dashed border-darkpink/30 rounded-lg h-96 text-center bg-darkpink/10 cursor-pointer  mx-auto my-10 w-full"
        >
            <label className="cursor-pointer h-full w-full flex items-center justify-center">
                <div className="text-lg text-darkpink/50 font-semibold mb-4">
                    Drag & drop images here, or click to upload
                </div>
            </label>
        </div>
    )
}