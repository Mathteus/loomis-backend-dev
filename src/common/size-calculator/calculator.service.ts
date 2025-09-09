export class CalculatorSizeService {
  private static _oneKB = 1024;
  private static _oneMB = 1048576;

  public static getKB(kb: number): number {
    return kb * CalculatorSizeService._oneKB;
  }

  public static getMB(mb: number): number {
    return mb * CalculatorSizeService._oneMB;
  }

  public static getMbFromKb(kb: number): number {
    return CalculatorSizeService.getMB(kb / CalculatorSizeService._oneKB);
  }
}
