export default function Custom() {
    return(
        <div
            className="border-2 border-dashed border-darkpink/30 rounded-lg py-20 text-center bg-darkpink/10 cursor-pointer  mx-auto my-10 w-full"
        >
            <label htmlFor="upload-image" className="cursor-pointer block">
                <div className="text-lg text-gray-500 mb-4">
                    Drag & drop images here, or click to upload
                </div>
                <input
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                />
            </label>
        </div>
    )
}