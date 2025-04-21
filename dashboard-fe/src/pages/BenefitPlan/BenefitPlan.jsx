import React from 'react'
import SlideBarComponent from '../../components/SlideBar/SlideBarComponent'
import './BenefitPlan.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

const BenefitPlan = () => {
    return (
        <div className='Container'>
            <div className='sidebar'>
                <SlideBarComponent />
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>John</td>
                        <td>Doe</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default BenefitPlan