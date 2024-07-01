import React from "react";
import styles from "./InfoSidebar.scss";
export function InfoSidebar() {
    return (
        <div>
            <div class="object-info-header">
                <h1>Welcome to Our Metaverse Classroom</h1>
            </div>
            <div class="object-info-container">
                <div class="object-info-content">
                    <h2>소개</h2>
                    <p>우리의 혁신적인 수학 교실에 오신 것을 환영합니다! 이곳에서는 학습이 재미있고 상호작용적입니다. 메타버스, 3D 콘텐츠, 게임화된 학습과 같은 첨단 기술을 사용하여 학생들이 수학을 흥미롭고 몰입할 수 있도록 만듭니다.</p>
                </div>

                <div class="object-info-content">
                    <h2>메타버스 활용</h2>
                    <p>우리 교실에서는 가상 환경에서 수학적 개념을 탐구합니다. 메타버스를 통해 학생들은 3D 공간에서 수학적 객체를 시각화하고 상호작용할 수 있어, 추상적인 개념을 더 구체적이고 이해하기 쉽게 만듭니다.</p>
                </div>

                <div class="object-info-content">
                    <h2>3D 콘텐츠</h2>
                    <p>우리 수업은 학생들이 복잡한 기하학적 모양과 개념을 이해하는 데 도움이 되는 3D 모델을 포함합니다. 이 상호작용하는 모델들은 다양한 관점을 보여주기 위해 조작될 수 있으며, 이를 통해 학생들이 교재를 더 깊이 이해할 수 있게 도와줍니다.</p>
                </div>

                <div class="object-info-content">
                    <h2>퀴즈와 미션</h2>
                    <p>우리는 학습을 강화하기 위해 게임으로서의 퀴즈와 미션을 활용합니다. 각 미션은 수학 문제를 해결하면서 진행되며, 학습을 모험으로 만듭니다. 학생들은 퀴즈와 미션을 완료함으로써 포인트와 보상을 얻으며, 성취감과 동기부여를 증진시킵니다.</p>
                </div>
            </div>
            <div class="object-info-footer">
                <p>© Tekville Metaverse Platform. All Rights Reserved.</p>
            </div>
        </div>
    );
}