"use client";
import { Slider } from "@/components/ui/slider";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

interface IFrame {
  id: number;
  name: string;
  image: string;
}

const frame: IFrame[] = [
  {
    id: 1,
    name: "Frame 1",
    image:
      "https://res.cloudinary.com/dqupovatf/image/upload/v1740806381/faexa1tfgmg4g3da32gm.png",
  },
  {
    id: 2,
    name: "Frame 2",
    image:
      "https://res.cloudinary.com/dqupovatf/image/upload/v1740806381/ovd0zucrg24gv6fssd4u.png",
  },
  {
    id: 3,
    name: "Frame 3",
    image:
      "https://res.cloudinary.com/dqupovatf/image/upload/v1740806361/yyytbsfjux6kpxl8ggx3.png",
  },
  {
    id: 4,
    name: "Frame 4",
    image:
      "https://res.cloudinary.com/dqupovatf/image/upload/v1740806361/cbaaqyypnzmchwgfv7vs.png",
  },
  {
    id: 5,
    name: "Frame 5",
    image:
      "https://res.cloudinary.com/dqupovatf/image/upload/v1740806360/adusj4o9f9hndqzs40ie.png",
  },
  {
    id: 6,
    name: "Frame 6",
    image:
      "https://res.cloudinary.com/dqupovatf/image/upload/v1740806360/adusj4o9f9hndqzs40ie.png",
  },
];

export default function Home() {
  const [image, setImage] = useState<string>("");
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [selectedFrame, setSelectedFrame] = useState<IFrame | null>(null);
  const [matting, setMatting] = useState<number>(0);
  const [ratio, setRatio] = useState<number>(1);

  const priceDefault = 100;

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === "success" && typeof result.info === "object") {
      const imageUrl = result.info.secure_url;
      const width = result.info.width;
      const height = result.info.height;
      setImage(imageUrl);
      setIsUpload(true);
      setSelectedFrame(frame[0]);
      setRatio(width / height || 1);
    }
  };

  const handleFrameSelect = (item: IFrame) => {
    setSelectedFrame(item.id === selectedFrame?.id ? null : item);
  };

  const handleSliderChange = (value: number[]) => {
    setMatting(value[0]);
  };

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Bố cục chia thành 2 cột ở màn hình >= md */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Cột 1: Ảnh + nút upload */}
        <div className="flex flex-col items-center mx-auto justify-start text-center">
          <p className="text-xl py-4 font-bold">Your image</p>

          {/* Container bao ảnh, dùng max-w để giới hạn, không fix height */}
          <div className="relative bg-gray-200 w-full max-w-[700px] rounded-lg flex items-center justify-center mx-auto">
            {/* Khung frame + ảnh */}
            <div
              className="relative hover:scale-105 duration-300 flex items-center justify-center"
              style={{
                // Áp dụng ảnh frame nếu có
                backgroundImage: selectedFrame
                  ? `url(${selectedFrame.image})`
                  : "none",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                // Tính toán kích thước hiển thị khung
                width: `${450 * (ratio > 1 ? 1 : ratio)}px`,
                height: `${450 / (ratio < 1 ? 1 : ratio)}px`,
                aspectRatio: ratio,
              }}
            >
              <Image
                src={
                  image ||
                  "https://i.pinimg.com/736x/f0/c1/8e/f0c18e4acb81767603ec693cb89cbdc3.jpg"
                }
                alt={image ? "Uploaded Image" : "Placeholder"}
                width={
                  ratio >= 1
                    ? 416 * (1 - matting / 100)
                    : 416 * ratio * (1 - matting / 100)
                }
                height={416}
                className="border z-50 border-gray-400 bg-gray-200 object-contain"
              />
            </div>
          </div>

          {/* Nút Upload */}
          <CldUploadWidget
            onSuccess={handleSuccess}
            uploadPreset="demo_frame_print"
          >
            {({ open }) => (
              <button
                onClick={() => open()}
                className="px-6 py-2 mt-4 bg-blue-500 duration-500 text-white font-semibold cursor-pointer rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {image ? "Change Image" : "Upload Image"}
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Cột 2: Chọn frame, slider, nút mua */}
        <div className="flex flex-col items-center gap-8 md:gap-10 justify-start">
          {isUpload && (
            <div className="flex flex-col gap-5 items-center text-center w-full">
              <p className="text-xl font-bold">Select your frame</p>
              {/* Danh sách frame (flex-wrap) để không bị chèn nhau */}
              <div className="flex flex-wrap items-center gap-3.5 justify-center">
                {frame.map((item) => (
                  <div
                    key={item.id}
                    className={`cursor-pointer hover:scale-105 duration-500 hover:-translate-y-2 
                      flex items-center justify-center border border-transparent 
                      ${selectedFrame?.id === item.id ? "border-orange-400" : ""}`}
                    onClick={() => handleFrameSelect(item)}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="border border-gray-400 bg-gray-200 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Slider điều chỉnh matting */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-5 w-full">
                <Slider
                  onValueChange={handleSliderChange}
                  className="bg-gray-300 rounded-full h-3 w-full max-w-[250px]"
                  value={[matting]}
                  max={50}
                  min={0}
                  step={10}
                />
                <p className="w-fit h-fit py-1 px-2 rounded-full bg-gray-200 text-sm md:text-base">
                  {(matting * 6) / 50}&quot; Mat
                </p>
              </div>

              {/* Nút mua */}
              <button className="w-full md:w-[300px] px-6 py-4 bg-blue-500 duration-500 text-white font-semibold cursor-pointer rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Buy with {matting === 0 ? 10 : (matting * priceDefault) / 50} $
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
