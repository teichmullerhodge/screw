
export interface NothingFoundProps {
  message: string, 
  imagePath: string 
}

export default function NothingFound(props: NothingFoundProps) {
  return (
          <div className="flex flex-col items-center justify-center mt-10">
              <img src={props.imagePath} width={250} height={250} className="opacity-50"/>
              <span>{props.message}</span>
          </div>
         )
}


