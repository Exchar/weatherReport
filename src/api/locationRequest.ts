import { locationAxios } from "../utils/request";

interface getCityLocationParams {
  // 检索城市名
  location: string;
  // apikey
  key: string;
  // 城市的上级行政区划，可设定只在某个行政区划范围内进行搜索，用于排除重名城市或对结果进行过滤，例如 adm=beijing
  adm?: string;
  // 返回结果的数量
  number?: number;
  // 多语言范围
  lang?: string;
}
interface cityLocationResponse {
  location: cityInfo[];
  refer: {
    license: string[];
    sources: string[];
  };
}

export const getCityLocation = (params: getCityLocationParams) =>
  locationAxios<cityLocationResponse>({
    url: "/city/lookup",
    params,
  });
