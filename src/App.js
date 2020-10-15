import React, { useEffect, useState } from 'react';
import './App.scss';
import {Pie} from 'react-chartjs-2';
import axios from "axios";
import * as d3 from 'd3';
import {pie, arc} from 'd3-shape';
import {scaleOrdinal} from 'd3-scale';

import{
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import HomePage from './HomePage/HomePage';
import Footer from './Footer/Footer';
import AboutPage from './AboutPage/AboutPage';
import Login from './Login/Login';

function App()  {
  var d3data = {};
  const [State, dataSource]=useState({});
  var Labels=[];
  var Data=[];
  
  const getBudget = ()=> {
    axios.get('http://localhost:3000/budget')
    .then(function (res) {
      
        for(var i = 0; i<res.data.myBudget.length; i++) {
            Data[i] = res.data.myBudget[i].budget;
            Labels[i] = res.data.myBudget[i].title;
            d3data[res.data.myBudget[i].title] = res.data.myBudget[i].budget; 
        }
        dataSource({
          datasets: [
              {
                  data: Data,
                  backgroundColor: [
                    '#ffcd56',
                    '#ff6384',
                    '#36a2eb',
                    '#fd6b19',
                    "#46b535",
                    "#05e2f1",
                    "#552bec",
                    "red",
                    "blue",
                    "green"
                ],
              }
          ],
          labels:Labels
      });
      createC(d3data);
    });
  };
  
  function createC(d3data)
  {
    var width = 550;
    var height = 550;
    var margin = 100;
    var radius = Math.min(width, height) / 2 - margin;

    var svg = d3.select('#d3chart')
          .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var color = scaleOrdinal()
          .domain(Data)
          .range([
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            "#46b535",
            "#05e2f1",
            "#552bec",
            "red",
            "blue",
            "green"
        ],);

    var Pie = pie()
          .sort(null)
          .value(function(d) {return d.value; });
    var data_ready = Pie(d3.entries(d3data));

    var aro = arc()
          .innerRadius(radius * 0.3)
          .outerRadius(radius * 0.8);

    var outerArc = arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);

    svg
          .selectAll('allSlices')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', aro)
          .attr('fill', function(d){ return(color(d.data.key)); })
          .attr('stroke', 'white')
          .style('stroke-width', '2px')
          .style('opacity', 0.7);

    svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr('stroke', 'black')
            .style('fill', 'none')
            .attr('stroke-width', 1)
            .attr('points', function(d) {
              var posA = aro.centroid(d);
              var posB = outerArc.centroid(d);
              var posC = outerArc.centroid(d);
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
              return [posA, posB, posC];
            });

    svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) { console.log(d.data.key) ; return d.data.key; } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? 'start' : 'end');
            });
  }

  useEffect(()=>{
    getBudget();
  },[]);
  
  return (
    <Router>
      <Menu/>
      <Hero/>
      <div className = "mainContainer">
        
        <Switch>
          <Route path ="/about">
            <AboutPage/>
          </Route>
          <Route path ="/login">
            <Login/>
          </Route>
          <Route path ="/">
            <HomePage/>
            <main className="center" id="main">
            

            <div style = {{height:"700px", width:"700px", alignItems:"center"}}> 
              <Pie data={State}/>
            </div>
            
            <div className="page-area">
            <div id = "d3chart"/>
            </div>
            </main>
          </Route>
          
        </Switch>
        
      </div>
      <Footer/>
    </Router>
  );

}

export default App;