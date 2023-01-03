import {
  NoticeBulkCreateBodyDto,
  NoticeCreateBodyDto,
} from "@controllers/v1/notices/dto";
import { mockUser } from "src/test/mock/users";

export const mockLectrueId = "clalvt2o10000hacd0nacahjf";

export const mockNoticeCreateInput: NoticeCreateBodyDto = {
  title: "FMS(차량관제)플랫폼 백엔드 개발자(JAVA,SPRING)",
  description:
    "IoT 기술과 빅데이터 분석기술을 이용하여 모빌리티와 자동차보험 등 다양한 분야에서 데이터를 수집 분석하여 고객의 필요와 목적에 따라 가공한 정보를 맞춤 제공하고 있습니다.",
  category: "developer",
};

export const mockNoticeBulkCreateInput: NoticeBulkCreateBodyDto = {
  notices: [
    {
      title: "FMS(차량관제)플랫폼 백엔드 개발자(JAVA,SPRING)",
      description:
        "IoT 기술과 빅데이터 분석기술을 이용하여 모빌리티와 자동차보험 등 다양한 분야에서 데이터를 수집 분석하여 고객의 필요와 목적에 따라 가공한 정보를 맞춤 제공하고 있습니다.",
      category: "developer",
    },
    {
      title: "가구 제품 엔지니어",
      description:
        "기획부터 제작까지 감각적인 감성으로 풀어낸 리빙 브랜드 'FLAT POINT'와 프리미엄 키친 브랜드 '키친리노'에서",
      category: "developer",
    },
    {
      title: "영상처리, 컴퓨터비전/딥러닝, 병역특례 가능",
      description:
        "시간, 공간, 도구, 신체의 제약 없이 소통하고 표현할 수 있는 세상을 그리고 있습니다",
      category: "developer",
    },
    {
      title: "웹 서비스 백엔드 개발자(python)",
      description:
        "꾸까(kukka)는 '일상에서 즐기는 꽃 문화를 만들자'는 미션 아래 국내 최대의 플라워 온라인 커머스 '꾸까'와 온라인 꽃 도매 플랫폼 '피카플라', 서울 내 5개의 오프라인 쇼룸을 운영하고 있어요.",
      category: "design",
    },
    {
      title: "Android Native Application 개발",
      description:
        "한세실업 경영정보팀의 Android Native Application 개발자를 모집합니다.",
      category: "design",
    },
  ],
};

export const mockNoticeBuildArgs = {
  title: "공공데이터로 파이썬 데이터 분석",
  description:
    "모빌리티 분야의 혁신을 통해 사람들의 삶을 더 즐겁고, 편하게 하는 플랫폼을 만듭니다. '스마트폰' 시대 구글과 애플처럼 '스마트카' 시대에 맞는 멋진 플랫폼을 성장시키려는 목표를 가지고 있어요.",
  category: "developer",
  companyId: "claja9xn40000nzcd1cq5b1si",
};

export const mockNotice = {
  id: "clalvt2o10000hacd0nacahjf",
  title: "FMS(차량관제)플랫폼 백엔드 개발자(JAVA,SPRING)",
  description:
    "IoT 기술과 빅데이터 분석기술을 이용하여 모빌리티와 자동차보험 등 다양한 분야에서 데이터를 수집 분석하여 고객의 필요와 목적에 따라 가공한 정보를 맞춤 제공하고 있습니다.",
  category: "developer",
  isPublished: false,
  isDeleted: false,
  companyId: "claja9xn40000nzcd1cq5b1si",
  createdAt: "2022-11-18 11:28:03",
  updatedAt: "2022-11-18 11:28:03",
};

export const mockNoticeWithStudents = {
  id: "clalvt2o10000hacd0nacahjf",
  title: "FMS(차량관제)플랫폼 백엔드 개발자(JAVA,SPRING)",
  description:
    "IoT 기술과 빅데이터 분석기술을 이용하여 모빌리티와 자동차보험 등 다양한 분야에서 데이터를 수집 분석하여 고객의 필요와 목적에 따라 가공한 정보를 맞춤 제공하고 있습니다.",
  category: "developer",
  isPublished: false,
  isDeleted: false,
  companyId: "claja9xn40000nzcd1cq5b1si",
  createdAt: "2022-11-18 11:28:03",
  updatedAt: "2022-11-18 11:28:03",
  students: [{ ...mockUser }],
};

export const mockNoticeList = [
  {
    id: "clamaeswu0000hhcdeo7ceix7",
    title: "Project manager (A-SPICE 인증 프로젝트)",
    category: "developer",
    description:
      "모빌리티 분야의 혁신을 통해 사람들의 삶을 더 즐겁고, 편하게 하는 플랫폼을 만듭니다. '스마트폰' 시대 구글과 애플처럼 '스마트카' 시대에 맞는 멋진 플랫폼을 성장시키려는 목표를 가지고 있어요.",
    isPublished: false,
    isDeleted: false,
    companyId: "claja9xn40000nzcd1cq5b1si",
    createdAt: "2022-11-18T09:16:52.064Z",
    updatedAt: "2022-11-18T09:16:52.064Z",
  },
  {
    id: "clamaeswv0001hhcdbu5shyux",
    title: "가구 제품 엔지니어(python)",
    category: "developer",
    description:
      "기획부터 제작까지 감각적인 감성으로 풀어낸 리빙 브랜드 'FLAT POINT'와 프리미엄 키친 브랜드 '키친리노'에서",
    isPublished: false,
    isDeleted: false,
    companyId: "claja9xn40000nzcd1cq5b1si",
    createdAt: "2022-11-18T09:16:52.064Z",
    updatedAt: "2022-11-18T09:16:52.064Z",
  },
];
export const mockNoticeRawSqlResult = [
  {
    id: "clap42hsj008hwfcd5i3tfila",
    title: "영상처리, 컴퓨터비전/딥러닝, 병역특례 가능",
    description:
      "시간, 공간, 도구, 신체의 제약 없이 소통하고 표현할 수 있는 세상을 그리고 있습니다",
    category: "developer",
    isDeleted: false,
    createdAt: "2022-11-20T08:42:38.618Z",
    updatedAt: "2022-11-20T08:42:38.618Z",
    registeredAt: "2022-11-20T08:42:38.654Z",
    userId: "clap42hq3000gwfcdcegtbmb4",
    username: "clap42hq3000iwfcd7ssubsxd",
    userEmail: "clap42hq3000hwfcd4f6bcfr2@gmail.com",
    companyName: "미니봇기업clap42hsb0",
  },
  {
    id: "clap42hsj008iwfcd8uce399g",
    title: "언리얼 엔진 블루프린트",
    description:
      "언리얼 엔진의 비주얼 스크립팅 시스템인 블루프린트를 프로그래머 관점에서 공부하며 익숙해지는",
    category: "game",
    isDeleted: false,
    createdAt: "2022-11-20T08:42:38.618Z",
    updatedAt: "2022-11-20T08:42:38.618Z",
    registeredAt: "2022-11-20T08:42:38.654Z",
    userId: "clap42hq40077wfcd61tydm9q",
    username: "clap42hq40079wfcdh4tt4jyt",
    userEmail: "clap42hq40078wfcd4m5vg4b8@gmail.com",
    companyName: "미니봇기업clap42hsb0",
  },
  {
    id: "clap42hsj008hwfcd5i3tfila",
    title: "영상처리, 컴퓨터비전/딥러닝, 병역특례 가능",
    description:
      "시간, 공간, 도구, 신체의 제약 없이 소통하고 표현할 수 있는 세상을 그리고 있습니다",
    category: "developer",
    isDeleted: false,
    createdAt: "2022-11-20T08:42:38.618Z",
    updatedAt: "2022-11-20T08:42:38.618Z",
    registeredAt: "2022-11-20T08:42:38.654Z",
    userId: "clap42hq4002awfcd3fwl0czg",
    username: "clap42hq4002cwfcdevqf6lf3",
    userEmail: "clap42hq4002bwfcdcsqjgmcw@gmail.com",
    companyName: "미니봇기업clap42hsb0",
  },
  {
    id: "clap42hsj008hwfcd5i3tfila",
    title: "영상처리, 컴퓨터비전/딥러닝, 병역특례 가능",
    description:
      "시간, 공간, 도구, 신체의 제약 없이 소통하고 표현할 수 있는 세상을 그리고 있습니다",
    category: "developer",
    isDeleted: false,
    createdAt: "2022-11-20T08:42:38.618Z",
    updatedAt: "2022-11-20T08:42:38.618Z",
    registeredAt: "2022-11-20T08:42:38.654Z",
    userId: "clap42hq4004awfcdcyhfdfxc",
    username: "clap42hq4004cwfcdbaw0ecjc",
    userEmail: "clap42hq4004bwfcd4ccxeepd@gmail.com",
    companyName: "미니봇기업clap42hsb0",
  },
  {
    id: "clap42hsj008fwfcdgtkma5hp",
    title: "파이썬 데이터 분석",
    description:
      "모빌리티 분야의 혁신을 통해 사람들의 삶을 더 즐겁고, 편하게 하는 플랫폼을 만듭니다. '스마트폰' 시대 구글과 애플처럼 '스마트카' 시대에 맞는 멋진 플랫폼을 성장시키려는 목표를 가지고 있어요.",
    category: "developer",
    isDeleted: false,
    createdAt: "2022-11-20T08:42:38.618Z",
    updatedAt: "2022-11-20T08:42:38.618Z",
    registeredAt: "2022-11-20T08:42:38.654Z",
    userId: "clap42hq30011wfcd28fp9lol",
    username: "clap42hq30013wfcd71ti25rj",
    userEmail: "clap42hq30012wfcd5yzif5gc@gmail.com",
    companyName: "미니봇기업clap42hsb0",
  },
  {
    id: "clap42hsj008gwfcd26mq1nuh",
    title: "FMS(차량관제)플랫폼 백엔드 개발자(JAVA,SPRING)",
    description:
      "IoT 기술과 빅데이터 분석기술을 이용하여 모빌리티와 자동차보험 등 다양한 분야에서 데이터를 수집 분석하여 고객의 필요와 목적에 따라 가공한 정보를 맞춤 제공하고 있습니다.",
    category: "developer",
    isDeleted: false,
    createdAt: "2022-11-20T08:42:38.618Z",
    updatedAt: "2022-11-20T08:42:38.618Z",
    registeredAt: "2022-11-20T08:42:38.654Z",
    userId: "clap42hq30021wfcdaudk3ra9",
    username: "clap42hq30023wfcdam6ydpjn",
    userEmail: "clap42hq30022wfcd05qz40zh@gmail.com",
    companyName: "미니봇기업clap42hsb0",
  },
];

export const mockNoticeListWithPage = {
  rows: [
    {
      id: "clap42hsj008hwfcd5i3tfila",
      title: "영상처리, 컴퓨터비전/딥러닝, 병역특례 가능",
      companyName: "미니봇기업clap42hsb0",
      category: "developer",
      description:
        "시간, 공간, 도구, 신체의 제약 없이 소통하고 표현할 수 있는 세상을 그리고 있습니다",
      createdAt: "2022-11-20T08:42:38.618Z",
      studentsCount: 3,
    },
    {
      id: "clap42hsj008iwfcd8uce399g",
      title: "언리얼 엔진 블루프린트",
      companyName: "미니봇기업clap42hsb0",
      category: "game",
      description:
        "언리얼 엔진의 비주얼 스크립팅 시스템인 블루프린트를 프로그래머 관점에서",
      createdAt: "2022-11-20T08:42:38.618Z",
      studentsCount: 1,
    },
    {
      id: "clap42hsj008fwfcdgtkma5hp",
      title: "Project manager (A-SPICE 인증 프로젝트)",
      companyName: "미니봇기업clap42hsb0",
      category: "developer",
      description:
        "모빌리티 분야의 혁신을 통해 사람들의 삶을 더 즐겁고, 편하게 하는 플랫폼을 만듭니다. '스마트폰' 시대 구글과 애플처럼 '스마트카' 시대에 맞는 멋진 플랫폼을 성장시키려는 목표를 가지고 있어요.",
      createdAt: "2022-11-20T08:42:38.618Z",
      studentsCount: 1,
    },
    {
      id: "clap42hsj008gwfcd26mq1nuh",
      title: "iOS 개발자",
      companyName: "미니봇기업clap42hsb0",
      category: "developer",
      description:
        "모바일에서 실시간으로 사용자의 안면과 몸의 움직임을 정확하게 인식하고 최적화하는 차별성은 날비만의 원천기술입니다. ",
      createdAt: "2022-11-20T08:42:38.618Z",
      studentsCount: 1,
    },
  ],
  totalCount: 4,
};

export const mockNoticeDetailResult = {
  id: "clap42hsj008hwfcd5i3tfila",
  title: "영상처리, 컴퓨터비전/딥러닝, 병역특례 가능",
  companyName: "미니봇기업clap42hsb0",
  category: "developer",
  description: "Vue.js로 실무 ",
  createdAt: "2022-11-20T08:42:38.618Z",
  updatedAt: "2022-11-20T08:42:38.618Z",
  studentsCount: 3,
  students: [
    {
      username: "clap42hq3000iwfcd7ssubsxd",
      registeredAt: "2022-11-20T08:42:38.654Z",
    },
    {
      username: "clap42hq4002cwfcdevqf6lf3",
      registeredAt: "2022-11-20T08:42:38.654Z",
    },
    {
      username: "clap42hq4004cwfcdbaw0ecjc",
      registeredAt: "2022-11-20T08:42:38.654Z",
    },
  ],
};
