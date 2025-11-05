import Image from "next/image";

const Logo = ({ icon=false ,h=32,w=32 }: { icon?: boolean ,h?:number,w?:number}) => {
  return (
    <div className="flex gap-2">
      <Image src={"/logo.png"} alt="logo" width={w} height={h} />
      {!icon && (
        <div>
          <span className="text-md font-semibold tracking-tight text-primary">
            Meta
          </span>
          <span className="text-md font-semibold tracking-tight text-secondary">
            Scan
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
