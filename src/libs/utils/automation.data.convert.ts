import { DateUtil } from '../core/date.utils';
import { DispatchStatus } from '../modes/dispatch.status';
import { IamwebOrderGoogleModel } from '../modes/iamweb.order';
import { IamwebOrderStatus } from '../modes/iamweb.order.status';
import { IamwebUtils } from './iamweb.utils';
import { AutomationConfig } from '../../config/iamweb.automation/automation.config';

/**
 * 자동화 프로그램에 데이터 변환을 처리
 */
export class AutomationDataConvert {
  /**
   * DB에서 조회한 IamwebOrder주문데이터 -> Dispath데이터로 변환 (json)
   * @param orderData
   * @param cellNum
   * @param dispatchStatus
   * @returns
   */
  async convertDispathFromIamwebOrderStringToJson(
    orderData: string,
    cellNum: number,
    dispatchStatus: DispatchStatus,
  ): Promise<any[]> {
    const formData: string[] = orderData.split(
      AutomationConfig.sign.arrToStrDelim,
    );

    const jsonNewData = [
      cellNum.toString(), // B '번호'
      formData[9], // C 주문번호
      formData[10], // D '결제일자' ,
      formData[11], // E '결제시간',
      '', // F 취소일자
      '', // G 취소시간
      formData[6], // 주문자명
      formData[7], // 주문자이메일
      formData[8], // 주문자연락처
      formData[13], //상품명
      formData[14], // 편도/대절
      formData[15], // 출발지명
      formData[16], // 출발지주소
      formData[17], // 도착공항
      formData[18], // 도착지명
      formData[19], // 도착지주소
      formData[20], // 출발공항
      formData[21], // 이용자명
      formData[22], // 이용자연락처
      formData[23], // 탑승일자
      formData[24], // 탑승시간
      formData[25], // 탑승인원
      formData[26], // 비행편
      formData[27], // 여행용가방수량
      formData[28], // 기타
      dispatchStatus, // S
    ];

    return jsonNewData;
  }

  /**
   * IamwegOrderModel -> IamwebOrder json으로 변환
   * @param orderData
   * @param cellNum
   * @param iamwebOrderStatus
   * @returns
   */
  async convertIamwebOrderFromIamwebOrderModelToJson(
    orderData: IamwebOrderGoogleModel,
    cellNum: number,
    iamwebOrderStatus: IamwebOrderStatus,
  ): Promise<any[]> {
    const formData = orderData.form;
    const yyyy_mm_dd = new DateUtil().YYYYMMDD(orderData.order_time, '-');
    const hh_mm_dd = new DateUtil().HHMMSS(orderData.order_time, ':');
    const snsChannel = formData[0].value;
    const snsId = formData[1].value;
    const boardingPersonCount = formData[2].value;
    const boardingDate = formData[3].value;
    const boardingTime = formData[4].value;
    const airplane = formData[5].value;
    const takeOffAndLandingTime = formData[6].value;
    const etc = formData[7].value;
    const jsonNewData = [
      cellNum.toString(), // '번호'
      iamwebOrderStatus.toString(), // '상태값'
      '-', // '구입채널'
      orderData.orderer.member_code, // '회원코드',
      orderData.orderer.name, //'닉네임',
      orderData.orderer.email, //'계정',
      orderData.orderer.name, //'주문자명',
      orderData.orderer.email, //'주문자 Email',
      orderData.orderer.call.toString(), // '주문자 연락처',
      orderData.order_no, //'주문번호',
      yyyy_mm_dd, //'결제일자',
      hh_mm_dd, //'결제시간',
      `${orderData.payment.total_price}(${orderData.payment.price_currency})`, //'결제금액',
      orderData.product_item.items.prod_name, // '상품명',
      orderData.product_item.items.orderType, // '대절, 편도'

      orderData.product_item.items.startLocation, //'출발지 위치명',
      orderData.product_item.items.startAddress, //'출발지주소',
      orderData.product_item.items.startAirport, //'출발공항',

      orderData.product_item.items.endLocation, //'도착지위치명',
      orderData.product_item.items.endAddress, // '도착지주소',
      orderData.product_item.items.endAirport, // '도착공항',
      snsChannel, //'SNS채널',
      snsId, //'SNS ID',
      boardingPersonCount, //'탐승인원',
      boardingDate, //'탑승일자',
      boardingTime, //'탑승시간',
      airplane, //'비행편',
      takeOffAndLandingTime, //'이착륙시간',
      etc, //'기타',
      '-',
      '-',
      '-',
    ];
    return jsonNewData;
  }
}
