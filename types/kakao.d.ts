/** 다음 주소 API로부터 전달받는 데이터 타입 정의 */
declare global {
  interface DaumPostcodeData {
    zonecode: string;
    roadAddress: string;
    jibunAddress: string;
    bname: string;
    buildingName: string;
    apartment: string;
    autoRoadAddress?: string;
    autoJibunAddress?: string;
  }

  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: () => void;
      }) => {
        open: () => void;
      };
    };
  }
}

export {};
