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
import { findDOMNode } from 'react-dom';
const alphabet = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");

function increasingSum(num, numIncreases, sum = 0) {
  return num > 0 ? increasingSum(num - 1, numIncreases, sum + num * numIncreases) : sum;
}

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

const polyominos = [
  hexominos,
  pentominos, pentominos,
  quadominos, quadominos, quadominos,
  triominos, triominos, triominos, triominos,
  duelominos, duelominos, duelominos, duelominos, duelominos,
  block, block, block, block, block, block,
].flat()

const allPoly = [...polyominos, ...polyominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})]

export default function App() {

  const width = 11

  var array = [...Array(width).keys()]

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

  const [pc1, setPc1] = useState()
  const [pc2, setPc2] = useState()
  const [pcIndex, setPcIndex] = useState(0)

  const onClickPc = useCallback((setPc) => {
    setPc(pcIndex)
    setPcIndex(pcIndex + 1)
  }, [pcIndex])

  const onClickRc = useCallback((setRc) => {
    setRc(rcIndex)
    setRcIndex(rcIndex + 1)
  }, [rcIndex])

  const onClickCell = useCallback((r, c, name) => {
    if (!coloredRef.current[name]) coloredRef.current[name] = {}
    if (!coloredRef.current[name][r]) coloredRef.current[name][r] = {}
    if (coloredRef.current[name][r][c] === "#222") coloredRef.current[name][r][c] = "#CCC"
    else if (coloredRef.current[name][r][c] === "#CCC") coloredRef.current[name][r][c] = "#FFF"
    else coloredRef.current[name][r][c] = "#222"
    setColored({ ...coloredRef.current })
  }, [])

  function getCellColor(r, c, name, defaultColor = "#FFF") {
    if (!colored[name]) return defaultColor
    if (!colored[name][r]) return defaultColor
    return colored[name][r][c];
  }

  const gridJsx = (
    <Table rowHeight={40} hideRowHeaders hideColumnHeaders>
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
          if ((a - 1 + i) % 6 === 0 && !(a & 1)) divider = "💰️"
          else if ((a - 1 - i - 2) % 6 === 0 && (a & 1)) divider = "💠️"
          else if (a === i && (a + 1) % 3 === 0) divider = "🌠️"
          else if (a === (width - 1 - i) && (a + 1) % 3 === 0) divider = "🌠️"
          else if (a === i && (a + 1) % 5 === 0) divider = "💣️"
          else if (a === (width - 1 - i) && (a + 1) % 5 === 0) divider = "💣️"
          else if (a === i && (a + 4) % 5 === 0) divider = "💣️"
          else if (a === (width - 1 - i) && (a + 4) % 5 === 0) divider = "💣️"

          let text = alphabet[i] + divider + (a + 1)
          if (a === 10 || a === 0 || i === 0 || i === 10) return null
          return (
            <TableCell
              onClick={() => onClickCell(a, i, 'main')}
              backgroundColor={getCellColor(a, i, 'main')}
              row={alphabet[a]}
              column={i}
              style={{
                width: 50,
                minWidth: 0,
                padding: 0,
                border: "solid 1px #CCC",
                color: "#CCC"
              }}
            >
              <div className="flex-center-middle align-center">
                {text}
              </div>
            </TableCell>
          )
        }).filter(v => v))).flat()}
    </Table >
  )

  return (
    <div className="flex">
      <LayoutDrawer style={{ width: 1000, border: "solid #CCC 1px" }}>
        <Drawer className={'padded-lg'}>
          Name:
      </Drawer>
        <Drawer className={'padded-lg'}>
          <LayoutDrawer type="column">
            {/* <Drawer>
              <div className="padded bold font-md"> On Your Turn </div>
              <div className='padded bold'>1. (In any order) Pick One Location on the Grid to Complete Privately, and Announce a 2nd Location that All Players Must Complete</div>
              <div className='padded bold'>2. Roll Dice Until Hold or Bust</div>
              <div className={'padded-md font-sm bold'} style={{ paddingLeft: 20 }}>
                Valid Rolls:
                <br /> a. 💰️ - Increase 💰️track by 1
                <br /> b. 💣️ - Gain 3 to Instantly Increase Opponents' 💣️track by 1
                <br /> c. Matching Numbers - Gain ⭐️ equal to sum of all but one die
              </div>
              <div className={'padded bold'}>4. Discard down to 2 shapes and 3 reposition cards</div>
              <div className="padded bold font-md"> At Any Time </div>
              <div className='padded bold'>Build a shape matching completed grids</div>
            </Drawer> */}

            <Drawer size={400}>
              <div>
                {gridJsx}
              </div>
              <div className="align-center fill-width padded bold font-md">
                Shop
              </div>
              <div className='flex-justify'>
                <div className='padded'>
                  <div className="padded bold font-md"> At Any Time </div>
                  💰️x2 - +1 Redirect Card
                  <br />
                  💰️x3 - +1 Shape Card
                  <br />
                  💰️x4 - Fill 1 Grid Location
                  <br />
                </div>
                <div className='padded-md'>
                  <div className="padded bold font-md"> On Your Turn </div>
                  💰️x3 - Reroll 1 Die
                  <br />
                  💰️x4 - Reroll Last Roll
                  <br />
                  💰️x6 - 1ns are 2s (buy before roll)
              </div>
              </div>
            </Drawer>
          </LayoutDrawer>
        </Drawer>

        <Drawer className={'padded-md flex-center-middle'}>
          {getShapeTableJsx("💰️", "💰️", 4, getCellColor, onClickCell, "orange")}
        </Drawer>
        <Drawer size={'auto'} className={'padded-lg flex-center-middle'} >
          <div style={{ paddingRight: 10 }}>
            🌠️
          </div>
          <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25} width={400}>
            {[...Array(5).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(5).keys()].map((c) => (
              <TableCell
                className="flex-center-middle"
                onClick={() => onClickCell(0, c, 'stars')}
                backgroundColor={getCellColor(0, c, 'stars')}
                row={0}
                column={c}
                style={{
                  width: "20%",
                  padding: 0,
                  border: "solid 1px #CCC",
                  color: "#CCC"
                }}>
                <div className="flex-center-middle align-center">
                  {[...Array(c < 2 ? 1 : c < 4 ? 2 : 4)].map(() => "⭐️")}
                  {/* {c < 2 ? 1 : c < 4 ? 2 : 4}x ⭐️ */}
                </div>
              </TableCell>
            ))}
          </Table>
        </Drawer>
        {/* <Drawer className={'padded-md'}>
          {getShapeTableJsx("🔷️", "🔲️", 5, getCellColor, onClickCell, "blue")}
        </Drawer> */}
        <Drawer size={"auto"} className={'padded-lg flex-center-middle'} style={{ paddingTop: 0 }} >
          <div style={{ paddingRight: 10 }}>
            ⭐️
        </div>
          <Table size="small" hideColumnHeaders rowHeight={25} width={600}>
            {[...Array(12).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(4).keys()].map((i) => {
              const interval = i - 1 && i ? (i - 1) * 2 : 1
              return (
                <RowHeaderCell className="flex-center-middle" id={i} style={{
                  width: (1 / 13 * 100) + "%",
                  padding: 0,
                  border: "solid 1px #CCC",
                  color: "#AAA",
                }}
                >
                  <div className="padded no-wrap flex-justify">
                    <div>
                      {i ? i + 4 : 5}x🎲️ {i > 1 ? "👥️" : ""}
                    </div>
                    <div style={{ padding: "0 5px" }}>
                      |
                    </div>
                    <div style={{ color: interval === 2 ? "orange" : interval === 4 ? "red" : undefined }}>
                      +{interval}
                    </div>
                  </div>
                </RowHeaderCell>
              )
            })}
            {[...Array(4).keys()].map((r) => [...Array(24).keys()].map((c) => {
              var value = (c + 1) * (r > 2 ? 4 : (r > 1 ? 2 : 1)) + (r * 12) + (r > 2 ? 12 : 0)
              var x = (c + 1 + r * 24);
              var bonus = value === 96 ? "END" : x % 16 === 0 ? "🔶️" : x % 8 === 0 ? "🔷️" : (x % 4 === 0 || value === 72|| value === 56) ? "💰️" : ""
              return (
                <TableCell
                  className="flex-center-middle"
                  onClick={() => onClickCell(r, c, 'points')}
                  backgroundColor={getCellColor(r, c, 'points')}
                  row={r}
                  column={c}
                  style={{
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
            {/* {[...Array(2).keys()].map((r) => [...Array(24).keys()].map((c) => {
              var extraVal = (c + 1) * (r + 1) + increasingSum(r, 24) > 40 ? 2 : 0
              var value = (c + 1) * (r + extraVal + 1) + increasingSum(r, 24)
              var bonus = value === 12 ? "END" : (c + 1 + r * 24) % 16 === 0 ? "🔶️" : (c + 1 + r * 24) % 8 === 0 ? "🔷️" : (c + 1 + r * 24) % 4 === 0 ? "💰️" : ""
              return (
                <TableCell
                  className="flex-center-middle"
                  onClick={() => onClickCell(r, c, 'points')}
                  backgroundColor={getCellColor(r, c, 'points', value > 85 ? '#FFF' : value > 24 ? "#EEE" : "#DDD")}
                  row={r}
                  column={c}
                  style={{
                    width: "5%",
                    padding: 0,
                    border: "solid 1px #CCC",
                    color: "#AAA",
                  }}
                >
                  <div className={bonus ? "flex-middle flex-justify" : "flex-center-middle"}>
                    {bonus && <div className="padded" style={{ visibility: "hidden" }}></div>}
                    <div>{value}</div>
                    {bonus && <div className="padded"> {bonus} </div>}
                  </div>
                </TableCell>
              )
            })).flat()} */}
          </Table>
        </Drawer>
        <Drawer size={'auto'} className={'padded-lg flex-center-middle'} style={{ paddingTop: 0 }}>
          <div style={{ paddingRight: 10 }}>
            💣️
          </div>
          <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25}>
            {[...Array(15).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(2).keys()].map((r) => [...Array(15).keys()].map((c) => (
              <TableCell
                className="flex-center-middle"
                onClick={() => onClickCell(r, c, 'bombs')}
                backgroundColor={getCellColor(r, c, 'bombs')}
                row={r}
                column={c}
                style={{
                  padding: 0,
                  border: "solid 1px #CCC",
                  color: "#CCC"
                }}>
                <div className="flex-center-middle align-center"> {(-6 * ((c + 1) + r * 15))}</div>
              </TableCell>
            ))).flat()}
          </Table>
        </Drawer>
        <Drawer size="auto">
          Rolling Rules
          <div className={'padded font-sm'}>
            Keep at least 1 valid result in order to re-roll the other dice or hold. (Kept dice cannot be re-rolled)
            <br />
            If holding, gain all previous numbered results individually (numbered dice from separate rolls do not combine).
            <br />
            Bust if a roll has no valid results (discard all dice).
            <div className={'padded-md font-sm'}>
              If all rolls are valid and there are no dice left, you may reset and reroll all dice, adding to your ⭐️ but cancelling any 💰️ or unresolved 💣️ rolls
            </div>
          </div>
        </Drawer>
      </LayoutDrawer >
      <LayoutDrawer style={{ width: 800, border: "solid #CCC 1px" }}>
        <Drawer className={'padded-lg'} size="auto">
          {Number.isFinite(pc1) ? <div className={'inline'} onClick={() => setPc1()}>{polyCards[pc1]} </div> : <button style={{ backgroundColor: "lightblue" }} onClick={() => onClickPc(setPc1)}>Shape Card 1</button>}
          {Number.isFinite(pc2) ? <div className={'inline'} onClick={() => setPc2()}>{polyCards[pc2]} </div> : <button style={{ backgroundColor: "lightblue" }} onClick={() => onClickPc(setPc2)}>Shape Card 2</button>}
        </Drawer>
        <Drawer className={'padded-lg'} size="auto">
          {Number.isFinite(rc1) ? <div className={'inline'} onClick={() => setRc1()}>{redirectCards[rc1]} </div> : <button style={{ backgroundColor: "pink" }} onClick={() => onClickRc(setRc1)}>Draw Redirect Card 1</button>}
          {Number.isFinite(rc2) ? <div className={'inline'} onClick={() => setRc2()}>{redirectCards[rc2]} </div> : <button style={{ backgroundColor: "pink" }} onClick={() => onClickRc(setRc2)}>Draw Redirect Card 2</button>}
          {Number.isFinite(rc3) ? <div className={'inline'} onClick={() => setRc3()}>{redirectCards[rc3]} </div> : <button style={{ backgroundColor: "pink" }} onClick={() => onClickRc(setRc3)}>Draw Redirect Card 3</button>}
        </Drawer>

      </LayoutDrawer >
      {/* <div className="flex-column" style={{ width: 600 }}> */}
        {/* {allPoly.map((shape) => generatePolyominos(shape))} */}
        {/* {generateTerraformCards()} */}
      {/* </div> */}

    </div >
  );
}

function getShapeTableJsx(shape, reward, mod, getCellColor, onClickCell, id) {
  return <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25} width={500}>
    {[...Array(20).keys()].map((i) => (
      <HeaderCell className="flex-center-middle" id={i}>
        <div className="flex-center-middle align-center"> {i + 1}</div>
      </HeaderCell>
    ))}
    {[...Array(3).keys()].map((r) => [...Array(20).keys()].map((c) => (
      <TableCell
        className="flex-center-middle"
        onClick={() => onClickCell(r, c, id)}
        backgroundColor={getCellColor(r, c, id, ((c + 1) & 1) ? "#FFF" : "#EEE")}
        row={r}
        column={c}
        style={{
          minWidth: 0,
          padding: 0,
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
          color: "#CCC"
        }}
      >
        <div className="flex-center-middle align-center">
          ⭕️
        </div>
      </TableCell>
    )

    return (
      <Table hideColumnHeaders hideRowHeaders rowHeight={50} width={250} className="inline">
        {[headersJsx, rowHeadersJsx, cellsJsx, centerCellJsx].flat()}
      </Table>
    )
  })
}

const rewards = {
  1: { vp: 0, coin: 4 },
  2: { vp: 0, coin: 5 },
  3: { vp: 4, coin: 2 },
  4: { vp: 4, coin: 4 },
  5: { vp: 8, coin: 2 },
  6: { vp: 8, coin: 4 }
}

function generatePolyominos(shape) {

  const rows = maxBy(shape, "1")[1] + 1;
  const columns = maxBy(shape, "0")[0] + 1;

  return (
    <div className="inline-top relative" style={{ width: '2in', height: "3in", border: "solid #EEE 1px" }}>
      <div className="bottom-right padded-mdn font-lg">
        <div>
          {rewards[shape.length].coin} 💰️
        </div>
        {rewards[shape.length].vp} ⭐️
      </div>
      <div className="flex-center-middle fill">
        <div>
          <Table noShadow hideColumnHeaders hideRowHeaders rowHeight={40} width={columns * 40} style={{ boxShadow: 'none' }} >
            {[...Array(columns).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(rows).keys()].map((r) => [...Array(columns).keys()].map((c) => {
              const cellIsBlock = shape.find(([col, row]) => col === c && row === r);
              return (
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
                    // color: !cellIsBlock? "lightblue" : "#FFF",
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
