import React, { useState, useCallback, useRef, useMemo } from 'react';
import '../work_in_this_folder/style.css';
import LayoutDrawer, { Drawer } from '../work_in_this_folder/layout_drawer/layout_drawer.jsx'
import Table, {
  RowHeaderCell, // the indexed row cell
  HeaderCell, // the indexed column cell
  TableHeaderCell, // the corner cell between Row Headers and Column Headers
  TableCell,
  Row,
  Body,
  Header,
} from '../work_in_this_folder/table/table.jsx'
import maxBy from 'lodash/maxBy'
import orderBy from 'lodash/orderBy'
import fonts from '../fontawesome-pro-5.14.0-web/css/all.css'

const alphabet = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
function increasingSum(num, numIncreases, sum = 0) {
  return num > 0 ? increasingSum(num - 1, numIncreases, sum + num * numIncreases) : sum;
}

const SPIDER = <i class="fas fa-spider"></i>
const DEER = <i class="fas fa-spider"></i>
const BUG = <i class="fas fa-spider"></i>
const RABBIT = <i class="fas fa-spider"></i>
const SQUIRREL = <i class="fas fa-spider"></i>
const POINTEDFLOWER = <i style={{ color: "purple" }} class="fas fa-fan"></i>
const FLOWER = <i style={{ color: "#2c89f2" }} class="fas fa-flower"></i>
const PEPPER = <i style={{ color: "red" }} class="fas fa-pepper-hot"></i>
const PLANT = <i style={{ color: "green" }} class="fas fa-spider"></i>
const GOLDLEAF = <i style={{ color: "green" }} class="fas fa-leaf"></i>
const DOVE = <i style={{ color: "#FFF" }} class="fas fa-dove"></i>

const GREENTILE = "#cbfdcb"
const BROWNTILE = "beige"

const TARGET = <i style={{ color: "#222" }} class="fas fa-dot-circle"></i>

// cannot discard without using
// cannot redirect to a filled space

const hexominos = [
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  [[1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 2], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 1], [1, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 1], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 2], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 0], [1, 3], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 1], [1, 2], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [0, 2], [0, 3], [0, 1]],
  [[0, 0], [1, 1], [2, 1], [0, 2], [0, 3], [0, 1]],
  [[2, 0], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 1], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 1], [0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 1], [1, 1], [1, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 3], [1, 1], [1, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 0], [1, 1], [1, 2], [0, 2], [0, 3], [0, 4]],
  [[1, 0], [1, 1], [1, 2], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [1, 0]],
  [[2, 0], [0, 1], [2, 1], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 0], [2, 1], [1, 0], [1, 1], [1, 2]],
  [[2, 0], [0, 2], [2, 1], [1, 3], [1, 1], [1, 2]],
  [[2, 0], [0, 1], [2, 1], [0, 3], [1, 1], [0, 2]],
  [[2, 0], [0, 1], [1, 0], [0, 3], [1, 1], [0, 2]],
  [[0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 2], [0, 1], [0, 0], [1, 1], [2, 0], [2, 1]],
  [[1, 2], [0, 1], [0, 0], [1, 1], [2, 0], [2, 1]],
  [[2, 0], [0, 2], [1, 0], [0, 3], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 2]],
  [[1, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 1]],
  [[2, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 1]],
  [[2, 0], [0, 2], [2, 1], [0, 3], [1, 1], [1, 2]],
]
const pentominos = [
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 1], [1, 1], [1, 2], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3]],
  [[0, 0], [1, 0], [2, 0], [1, 2], [1, 1]],
  [[0, 0], [0, 1], [2, 0], [1, 1], [2, 1]],
  [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]],
  [[2, 0], [2, 1], [1, 1], [1, 2], [0, 2]],
  [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [1, 2]],
  [[0, 2], [1, 0], [2, 0], [1, 2], [1, 1]],
]
const quadominos = [
  [[0, 1], [1, 0], [2, 0], [1, 1]],
  [[0, 1], [1, 0], [2, 0], [0, 0]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
]

const triominos = [
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
]
const duelominos = [
  [[0, 1], [0, 0]],
]
const block = [
  [[0, 0]],
]

const SHAPE = (
  <div className="inline">
    <div className="flex">
      <div style={{ width: 10, height: 10, border: "1px solid #222" }}></div>
      <div style={{ width: 10, height: 10, border: "1px solid #222", borderLeft: 0 }}></div>
    </div>
    <div style={{ width: 10, height: 10, border: "1px solid #222", borderTop: 0 }}></div>
  </div>
)

const polyominos = [
  hexominos,
  pentominos, pentominos,
  quadominos, quadominos, quadominos,
  triominos, triominos, triominos, triominos,
  duelominos, duelominos, duelominos, duelominos, duelominos,
  block, block, block, block, block, block,
].flat()

const secretPoly3 = orderBy([...triominos, ...triominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})], () => Math.random())[0]

const secretPoly4 = orderBy([...quadominos, ...quadominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})], () => Math.random())[0]

const secretPoly5 = orderBy([...pentominos, ...pentominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})], () => Math.random())[0]

const allPoly = [...polyominos, ...polyominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})]

export default function App() {

  const width = 11

  var array = [...Array(width).keys()]
  var walkArray = [...Array(13).keys()]

  const coloredRef = useRef({})
  const [colored, setColored] = useState({})

  const polyCards = useMemo(() => orderBy(allPoly.map((shape) => generatePolyominos(shape)), () => Math.random()), [])

  const redirectCards = useMemo(() => {
    return orderBy([
      generateTerraformCards(0),
      generateTerraformCards(0),
    ].flat(), () => Math.random())
  }, [])

  const [rc1, setRc1] = useState();
  const [rc2, setRc2] = useState();
  const [rc3, setRc3] = useState();
  const [rcIndex, setRcIndex] = useState(0)

  const [pc1, _setPc1] = useState()
  const [pc2, _setPc2] = useState()
  const [completedCards, setCompletedCards] = useState([])

  const setPc1 = useCallback(() => {
    setCompletedCards([pc1, ...completedCards]);
    _setPc1()
  }, [completedCards, pc1])

  const setPc2 = useCallback(() => {
    setCompletedCards([pc2, ...completedCards]);
    _setPc2()
  }, [completedCards, pc2])

  const [pcIndex, setPcIndex] = useState(0)

  const onClickPc = useCallback((setPc) => {
    setPc(pcIndex)
    setPcIndex(pcIndex + 1)
  }, [pcIndex])

  const onClickRc = useCallback((setRc) => {
    setRc(rcIndex)
    setRcIndex(rcIndex + 1)
  }, [rcIndex])

  const [mostRecentRover, setMostRecentRover] = useState([])

  const onClickCell = useCallback((r, c, name) => {
    if (!coloredRef.current[name]) coloredRef.current[name] = {}
    if (!coloredRef.current[name][r]) coloredRef.current[name][r] = {}

    if (!coloredRef.current[name][r][c]) {
      coloredRef.current[name][r][c] = name !== "points" ? "blue" : "#222"
      if (name === "walk") {
        setMostRecentRover([r, c])
      }
    }
    else if (coloredRef.current[name][r][c] === "blue") coloredRef.current[name][r][c] = "#222"
    else coloredRef.current[name][r][c] = undefined

    setColored({ ...coloredRef.current })
  }, [])

  function getCellColor(r, c, name, defaultColor) {
    if (!colored[name]) return defaultColor
    if (!colored[name][r]) return defaultColor
    return colored[name][r][c];
  }

  const gridJsx = (
    <Table rowHeight={45} hideRowHeaders hideColumnHeaders style={{ width: 45 * 10 }}>
      {array.map((i) => (i === 0 || i === 10) ? null : (
        <HeaderCell className="flex-center-middle" id={i}>
          <div className="flex-center-middle align-center"> {i + 1}</div>
        </HeaderCell>
      ))}
      {array.map((i) => (i === 0 || i === 10) ? null : (
        <RowHeaderCell className="flex-center-middle" id={alphabet[i]}>
          <div className="flex-center-middle align-center"> {alphabet[i]}</div>
        </RowHeaderCell>
      ))}
      {array.map((i) => (
        array.map((a) => {
          let divider = "-"
          if ((a - 1 + i) % 6 === 0 && !(a & 1)) divider = GOLDLEAF
          else if ((a - 1 - i - 2) % 6 === 0 && (a & 1)) divider = POINTEDFLOWER
          else if (a === i && (a + 1) % 3 === 0) divider = DOVE
          else if (a === (width - 1 - i) && (a + 1) % 3 === 0) divider = DOVE
          else if (a === i && (a + 1) % 5 === 0) divider = PEPPER
          else if (a === (width - 1 - i) && (a + 1) % 5 === 0) divider = PEPPER
          else if (a === i && (a + 4) % 5 === 0) divider = PEPPER
          else if (a === (width - 1 - i) && (a + 4) % 5 === 0) divider = PEPPER
          else if ((a === 1 && i === 2) || (i === 1 && a === 2)) divider = GOLDLEAF
          else if ((a === 1 && i === 8) || (i === 1 && a === 8)) divider = GOLDLEAF
          else if ((a === 9 && i === 8) || (i === 9 && a === 8)) divider = GOLDLEAF
          else if ((a === 9 && i === 2) || (i === 9 && a === 2)) divider = GOLDLEAF

          let text = <span>{alphabet[i]} {divider} {(a + 1)} </span>
          if (a === 10 || a === 0 || i === 0 || i === 10) return null
          const backgroundColor = getCellColor(a, i, 'main')
          const defaultBackgroundColor = divider === DOVE ? "lightblue" : ((i + a * 11) > 60) ^ ((i + a) % 4 === 0 || (i - a) % 3 === 0) ? BROWNTILE : GREENTILE;
          return (
            <TableCell
              onClick={() => onClickCell(a, i, 'main')}
              backgroundColor={backgroundColor || defaultBackgroundColor}
              row={alphabet[a]}
              column={i}
              style={{
                width: 50,
                minWidth: 0,
                padding: 0,
                border: "solid 1px #BBB",
                cursor: "pointer",
                color: backgroundColor ? defaultBackgroundColor === 'pink' ? 'pink' : defaultBackgroundColor === "#DDD" ? "#CCC" : "#FFF" : "#666"
              }}
            >
              <div className={"flex-center-middle align-center" + (backgroundColor ? " bold" : "")}>
                {text}
              </div>
            </TableCell>
          )
        }).filter(v => v))).flat()}
    </Table >
  )

  const walkJsx = (
    <Table rowHeight={35} hideRowHeaders hideColumnHeaders style={{ width: walkArray.length * 35 }}>
      {walkArray.map((i) => (
        <HeaderCell className="flex-center-middle" id={i}>
          <div className="flex-center-middle align-center"> {i + 1}</div>
        </HeaderCell>
      ))}
      {walkArray.map((i) => (
        <RowHeaderCell className="flex-center-middle" id={i}>
          <div className="flex-center-middle align-center"> {i}</div>
        </RowHeaderCell>
      ))}
      {walkArray.map((i) => (
        walkArray.map((a) => {
          let divider = ""

          if ((!a && !i) || (a === walkArray.length - 1 && i === walkArray.length - 1)) divider = SHAPE
          else if ((!a && i === walkArray.length - 1) || (a === walkArray.length - 1 && !i)) divider = TARGET
          else if ((a + i) % 4 === 0 && a % 4 === 0) divider = GOLDLEAF
          else if ((a + i) % 8 === 0 && (a + 2) % 8 === 0) divider = GOLDLEAF
          else if ((a + i) % 8 === 0 && (a + -2) % 8 === 0) divider = TARGET
          else if (i < 6 && (a + i + 5) % 8 === 0 && (a - 2) % 8 === 0) divider = PEPPER
          else if (((a + i + 4) % 8 === 0 && (a - 2) % 8 === 0) && (i > 6 ^ a < 6)) divider = FLOWER
          else if ((a + i + 4) % 8 === 0 && (a - 2) % 8 === 0) divider = SHAPE
          else if (i < 6 && (a + i + 3) % 8 === 0 && (a - 2) % 8 === 0) divider = PEPPER
          else if ((a === ((walkArray.length - 1) / 2)) && (i === ((walkArray.length - 1) / 2))) divider = FLOWER
          else if (i > 6 && (a + 1 + i + 4) % 8 === 0 && (a + 1 - 2) % 8 === 0) divider = PEPPER
          else if (i > 6 && (a - 1 + i + 4) % 8 === 0 && (a - 1 - 2) % 8 === 0) divider = PEPPER
          // else if (i === 9 && a === 10) divider = PEPPER
          // else if (i === 2 && a === 3) divider = PEPPER

          else if ((a + i + 2 + 4) % 8 === 0 && (a + 1 + 2) % 8 === 0) divider = PEPPER
          else if ((a + i + 4) % 8 === 0 && (a - 1 + 2) % 8 === 0) divider = PEPPER
          else if ((a + i + 4) % 8 === 0 && (a + 1 + 2) % 8 === 0) divider = PEPPER
          else if ((a + i + 2) % 8 === 0 && (a - 1 + 2) % 8 === 0) divider = PEPPER
          // else if (!(a & 1) && i === 0) divider = GOLDLEAF

          let defaultCellColor = (a & 1 || i === ((walkArray.length - 1) / 4) || i === (walkArray.length - 1 - (walkArray.length - 1) / 4) ? BROWNTILE : GREENTILE);
          if (a === 2 || a === 10) {
            defaultCellColor = (i === 5 || i === 7) ? BROWNTILE : GREENTILE
          }
          let cellColor = getCellColor(a, i, 'walk') || defaultCellColor
          if (cellColor === "blue" && (mostRecentRover[0] !== a || mostRecentRover[1] !== i)) {
            cellColor = "#222"
          }

          return (
            <TableCell
              onClick={() => onClickCell(a, i, 'walk')}
              backgroundColor={cellColor}
              row={a}
              column={i}
              style={{
                width: 25,
                minWidth: 0,
                padding: 0,
                cursor: "pointer",
                border: "solid 1px #BBB",
                color: "#BBB"
              }}
            >
              <div className="flex-center-middle align-center">
                {divider}
              </div>
            </TableCell>
          )
        }).filter(v => v))).flat()}
    </Table >
  )

  return (
    <div className="scroll-x flex fill">
      <LayoutDrawer type="column" className="fill ">
        <Drawer size="grow" minSize={300} className="background-e align-center scroll-y">
          <div className="fill" style={{ direction: 'rtl' }}>
            Completed Shapes
        <br />
            {completedCards.map((v, i) => {
              const card = i + 1
              let opacity = .5;
              if (card === 1) opacity = 1
              return (
                <div className={(card === 1 ? "" : "inline") + " padded align-center"} style={{ direction: "ltr", opacity }}>
                  {completedCards.length - i}
                  <br></br>
                  {polyCards[v]}
                </div>
              )
            })}
            <br></br>
            <div className="inline" style={{ width: 250 }}></div><div className="inline" style={{ width: 250 }}></div>
          </div>
        </Drawer>
        <Drawer size="grow" minSize={800} className="padded-sm align-center background-f padded-lg scroll-y">
          Blight
          <LayoutDrawer >
            <Drawer >
              <LayoutDrawer type="column">
                <Drawer >
                  <div className="">
                    <div className="align-center">
                      <b>Garden</b>
                      <div>
                        {gridJsx}
                      </div>
                    </div>
                    <div className="align-center">
                      <b>Greenhouse</b>
                      <div>
                        {walkJsx}
                      </div>
                    </div>
                  </div>
                </Drawer>
                <Drawer>
                  <b>
                    Set Up
                  </b>
                  <ol>
                    <li className="align-left">
                      A Player reveals 5 Shape Cards, one at a time, face up for all to see
                    </li>
                    <ol>
                      <li className="align-left">
                        For each Shape Card, draw that shape anywhere on the Garden by putting an "X" in each space and outlining the overall shape. Do not cover any peppers.
                      </li>
                      <li className="align-left">
                        Draw that shape anywhere on the Greenhouse following the same rules.
                      </li>
                    </ol>
                    <li className="align-left">
                      Take 1 Shape Card and 1 Redirect Card from each deck.
                    </li>
                    <li className="align-left">
                      Draw an "X" in any space on the Garden and gain its benefits, if any.
                    </li>
                    <li className="align-left">
                      Draw an "X" in any space on the Greenhouse matching the color of the space you filled in for the previous step. Gain its benefits, if any.
                    </li>
                  </ol>

                  <b>
                    Legend
                  </b>
                  <ul>
                    <li className="align-left">
                      {GOLDLEAF} - Gain 1 {GOLDLEAF} by circling it on the {GOLDLEAF} Track.
                    </li>
                    <li className="align-left">
                      {POINTEDFLOWER} - Fill in an adjacent space for free.
                    </li>
                    <li className="align-left">
                      <i style={{ color: "#CCC" }} class="fas fa-dove"></i> - Move Caterpillar 3 spaces. Draw an "X" in the space it leaves and enters.
                    </li>
                    <li className="align-left">
                      {PEPPER} - All other Players gain 1 {FLOWER}.
                    </li>
                    <li className="align-left">
                      {FLOWER} - Increase Point Track by 1.
                    </li>
                    <li className="align-left">
                      {SHAPE} - Gain a Shape Card.
                    </li>
                    <li className="align-left">
                      {TARGET} - Gain a Redirect Card.
                    </li>
                  </ul>

                  <b>
                    Important Notes
                  </b>
                  <ul>
                    <li className="align-left">
                      After filling in a space on the Garden, you must immediately mark a space of the same color on the Greenhouse adjacent to your Caterpillar if possible. Mark this space by drawing an arrow away from the previous space.
                    </li>
                    <li className="align-left">
                      You may make a purchase from the shop at any time. Cross out any {GOLDLEAF} used.
                    </li>
                  </ul>

                  <b>
                    On Your Turn
                  </b>
                  <ul>
                    <li className="align-left">
                      In any order, select one space on the Garden to fill privately, and one to fill publicly.
                    </li>
                  </ul>
                </Drawer>
              </LayoutDrawer>
            </Drawer>
            <Drawer size='auto' className='flex-center-middle'>
              <div className="fill-width margin-sm padded flex" style={{ border: "solid #222 1px" }}>
                <div className="align-center fill-width padded bold font-md" style={{ textDecoration: "underline" }}>
                  Shop
                </div>
                <div className='fill-width align-left'>
                  <div>2x{GOLDLEAF}: +1 Redirect Card</div>
                  <div>3x{GOLDLEAF}: +1 Shape Card</div>
                </div>
                <div className='fill-width align-left'>
                  <div>4x{GOLDLEAF}: Discard 1 Card</div>
                  <div>5x{GOLDLEAF}: Fill 1 Grid Location</div>
                </div>
              </div>
            </Drawer>
            <Drawer className={'padded-md flex-center-middle'}>
              {getShapeTableJsx(GOLDLEAF, GOLDLEAF, 4, getCellColor, onClickCell, "orange")}
            </Drawer>
            <Drawer size={"auto"} className={'padded-lg flex-center-middle'} style={{ paddingTop: 0 }} >
              Points
              <div style={{ paddingRight: 10 }}>
                {FLOWER}
              </div>
              <Table size="small" hideColumnHeaders rowHeight={25} width={550}>
                {[...Array(12).keys()].map((i) => (
                  <HeaderCell className="flex-center-middle" id={i}>
                    <div className="flex-center-middle align-center"> {i + 1}</div>
                  </HeaderCell>
                ))}
                {[...Array(1).keys()].map((r) => [...Array(24).keys()].map((c) => {
                  var value = (c + 1) + r * 12;

                  let bonus = ""
                  if (value === 24) {
                    bonus = "END"
                  } else if ([2, 11].includes(value)) {
                    bonus = SHAPE
                  } else if ([5, 8].includes(value)) {
                    bonus = TARGET
                  }
                  // else if (value <= 6 || [8, 12, 14, 16, 18].includes(value)) {
                  //   bonus = GOLDLEAF
                  // }
                  return (
                    <TableCell
                      className="flex-center-middle"
                      onClick={() => onClickCell(r, c, 'points')}
                      backgroundColor={getCellColor(r, c, 'points')}
                      row={r}
                      column={c}
                      style={{
                        cursor: "pointer",
                        width: (1 / 13 * 100) + "%",
                        padding: 0,
                        border: "solid 1px #CCC",
                        color: "#AAA",
                      }}
                    >
                      <div className={bonus ? "flex-middle flex-justify padded" : "flex-center-middle padded"}>
                        <div>
                          {value}
                        </div>
                        <div>
                          {bonus}
                        </div>
                      </div>
                    </TableCell>
                  )
                })).flat()}
              </Table>
            </Drawer>
            {/* <Drawer size={'auto'} className={'padded-lg flex-center-middle '} style={{ paddingTop: 0 }}>
              <div style={{ paddingRight: 10 }}>
                💣️
              </div>
              <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25} width={50 * 15}>
                {[...Array(12).keys()].map((i) => (
                  <HeaderCell className="flex-center-middle" id={i}>
                    <div className="flex-center-middle align-center"> {i + 1}</div>
                  </HeaderCell>
                ))}
                {[...Array(1).keys()].map((r) => [...Array(12).keys()].map((c) => (
                  <TableCell
                    className="flex-center-middle"
                    onClick={() => onClickCell(r, c, 'bombs')}
                    backgroundColor={getCellColor(r, c, 'bombs')}
                    row={r}
                    column={c}
                    style={{
                      width: 50,
                      padding: 0,
                      cursor: "pointer",
                      border: "solid 1px #CCC",
                      color: "#CCC"
                    }}>
                    <div className="flex-center-middle align-center"> {(-2 * ((c + 1) + r * 15))}</div>
                  </TableCell>
                ))).flat()}
              </Table>
            </Drawer> */}
            <Drawer >
              <div className="flex-center-middle fill">
                Secret Objectives (Fit these in empty spaces at game end to gain their points)
          </div>
              <div className="flex-center-middle fill ">
                {[secretPoly3, secretPoly4, secretPoly5].map(v => generatePolyominos(v, true))}
              </div>
            </Drawer>
          </LayoutDrawer >
        </Drawer>
        <Drawer className='padded-lg align-center background-e scroll-y' size="grow" minSize={300} >
          Your Hand <br></br>
          {Number.isFinite(pc1) ?
            <div className={'inline-top'} style={{ border: "solid 2px lightblue", margin: 3, }} onClick={() => setPc1()}>{polyCards[pc1]} </div>
            : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "lightblue", width: 196, height: 292 }} onClick={() => onClickPc(_setPc1)}>Draw Shape Card</button>
          }
          {Number.isFinite(pc2) ? <div className={'inline-top'} style={{ border: "solid 2px lightblue", margin: 3, }} onClick={() => setPc2()}>{polyCards[pc2]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "lightblue", width: 196, height: 292 }} onClick={() => onClickPc(_setPc2)}>Draw Shape Card</button>}
          <br></br><br></br>
          {Number.isFinite(rc1) ? <div className={'inline-top margin'} style={{ border: "solid 2px orange", lineHeight: 0 }} onClick={() => setRc1()}>{redirectCards[rc1]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "orange", width: 254, height: 255 }} onClick={() => onClickRc(setRc1)}>Draw Redirect Card</button>}
          {Number.isFinite(rc2) ? <div className={'inline-top margin'} style={{ border: "solid 2px orange", lineHeight: 0 }} onClick={() => setRc2()}>{redirectCards[rc2]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "orange", width: 254, height: 255 }} onClick={() => onClickRc(setRc2)}>Draw Redirect Card</button>}
          {Number.isFinite(rc3) ? <div className={'inline-top margin'} style={{ border: "solid 2px orange", lineHeight: 0 }} onClick={() => setRc3()}>{redirectCards[rc3]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "orange", width: 254, height: 255 }} onClick={() => onClickRc(setRc3)}>Draw Redirect Card</button>}
        </Drawer>
      </LayoutDrawer >
    </div>
  );
}

function getShapeTableJsx(shape, reward, mod, getCellColor, onClickCell, id) {
  return <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25} width={500}>
    {[...Array(20).keys()].map((i) => (
      <HeaderCell className="flex-center-middle" id={i}>
        <div className="flex-center-middle align-center"> {i + 1}</div>
      </HeaderCell>
    ))}
    {[...Array(4).keys()].map((r) => [...Array(20).keys()].map((c) => (
      <TableCell
        className="flex-center-middle"
        onClick={() => onClickCell(r, c, id)}
        backgroundColor={getCellColor(r, c, id, "#FFF")}
        row={r}
        column={c}
        style={{
          minWidth: 0,
          padding: 0,
          cursor: "pointer",
          border: "solid 1px #CCC",
          color: "#CCC"

        }}
      >
        <div className="flex-center-middle align-center">
          {((c + 1) + r * 20) % mod === 0 ? reward : shape}
        </div>
      </TableCell>
    ))).flat()}
  </Table>
}

function generateTerraformCards(type) {
  const width = 5;
  const cells = (width * width - 1) / 2
  return [...Array(cells).keys()].map((cardIndex) => {

    const headersJsx = [...Array(width).keys()].map((i) => <HeaderCell id={i} />)
    const rowHeadersJsx = [...Array(width).keys()].map((i) => <RowHeaderCell id={i} />)

    const cellsJsx = [...Array(cells).keys()].map((i) => {
      const r = Math.floor(i / width);
      const c = i % width;

      const rRotated = width - c - 1
      const cRotated = r

      const r2 = width - r - 1;
      const c2 = width - c - 1;

      const r2Rotated = width - c2 - 1
      const c2Rotated = r2

      return (
        [
          <TableCell
            className="flex-center-middle"
            row={r}
            column={c}
            style={{
              width: 20,
              minWidth: 0,
              padding: 0,
              border: "solid 1px #CCC",
              cursor: "pointer",
              color: "#CCC"
            }}
          >
            <div className="flex-center-middle align-center">
              {(c + r * width) === cardIndex || (cRotated + rRotated * width) === cardIndex || (c2Rotated + r2Rotated * width) === cardIndex ? "🔴️" : ""}
            </div>
          </TableCell>,
          <TableCell
            className="flex-center-middle"
            row={r2}
            column={c2}
            style={{
              width: 20,
              minWidth: 0,
              padding: 0,
              border: "solid 1px #CCC",
              color: "#CCC"
            }}
          >
            <div className="flex-center-middle align-center">
              {(c2 + r2 * width) === (width * width - cardIndex - 1) || (cRotated + rRotated * width) === (width * width - cardIndex - 1) || (c2Rotated + r2Rotated * width) === (width * width - cardIndex - 1) ? "🔴️" : ""}
            </div>
          </TableCell>
        ]
      )
    }).flat()

    const centerCellJsx = (
      <TableCell
        className="flex-center-middle"
        row={(width - 1) / 2}
        column={(width - 1) / 2}
        style={{
          width: 20,
          minWidth: 0,
          padding: 0,
          border: "solid 1px #CCC",
          color: "#CCC",
        }}
      >
        <div className="flex-center-middle align-center">
          ⭕️
        </div>
      </TableCell>
    )

    return (
      <Table noShadow hideColumnHeaders hideRowHeaders rowHeight={50} width={250} className="inline">
        {[headersJsx, rowHeadersJsx, cellsJsx, centerCellJsx].flat()}
      </Table>
    )
  })
}

const rewards = {
  1: { vp: 0, coin: 4 },
  2: { vp: 0, coin: 5 },
  3: { vp: 1, coin: 2 },
  4: { vp: 1, coin: 4 },
  5: { vp: 2, coin: 2 },
  6: { vp: 2, coin: 4 }
}

function generatePolyominos(shape, secret) {

  const rows = maxBy(shape, "1")[1] + 1;
  const columns = maxBy(shape, "0")[0] + 1;

  return (
    <div className={" inline-top relative " + (secret ? "background-e margin" : "background-f")} style={{ width: '2in', height: "3in", border: secret && "solid #AAA 1px" }}>
      <div className="bottom-right padded-mdn font-lg">
        {!secret && <div>
          {rewards[shape.length].coin} {GOLDLEAF}
        </div>}
        {rewards[shape.length].vp + (secret ? 1 : 0)} {FLOWER}
      </div>
      <div className="flex-center-middle fill">
        <div>
          <Table noShadow hideColumnHeaders hideRowHeaders rowHeight={40} width={columns * 40} style={{ boxShadow: 'none', backgroundColor: secret ? "#EEE" : "#FFF" }} >
            {[...Array(columns).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(rows).keys()].map((r) => [...Array(columns).keys()].map((c) => {
              const cellIsBlock = shape.find(([col, row]) => col === c && row === r);
              return !secret ? (
                <TableCell
                  className="flex-center-middle"
                  row={r}
                  column={c}
                  backgroundColor={cellIsBlock ? "#EEE" : "transparent"}
                  style={{
                    width: 50,
                    padding: 0,
                    border: cellIsBlock ? "solid 1px #CCC" : "none",
                    boxShadow: cellIsBlock && "5px 5px 0px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)"
                    // color: !cellIsBlock? "lightblue" : GREENTILE,
                  }}
                />
              ) : (
                  <TableCell
                    className="flex-center-middle"
                    row={r}
                    column={c}
                    backgroundColor={cellIsBlock ? "#FFF" : "transparent"}
                    style={{
                      width: 50,
                      padding: 0,
                      border: cellIsBlock ? "solid 1px #CCC" : "none",
                      boxShadow: cellIsBlock && "5px 5px 0px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)"
                      // color: !cellIsBlock? "lightblue" : GREENTILE,
                    }}
                  />
                )
            })).flat()}
          </Table>
        </div>
      </div>
    </div>
  )
}
